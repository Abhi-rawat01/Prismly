// Enhanced WhatsApp Chat Parser with Multiple Format Support

export interface ParseProgress {
  current: number;
  total: number;
  percentage: number;
  stage: string;
}

export type ChatFormat = 'android' | 'ios' | 'unknown';

// Detect chat format
export const detectChatFormat = (content: string): ChatFormat => {
  const lines = content.split('\n').slice(0, 100); // Check first 100 lines
  
  // Android format: "DD/MM/YYYY, HH:MM - Name: Message"
  const androidPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s-\s/;
  
  // iOS format: "[DD/MM/YYYY, HH:MM:SS] Name: Message"
  const iosPattern = /^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s/;
  
  let androidCount = 0;
  let iosCount = 0;
  
  lines.forEach(line => {
    if (androidPattern.test(line)) androidCount++;
    if (iosPattern.test(line)) iosCount++;
  });
  
  if (androidCount > iosCount && androidCount > 5) return 'android';
  if (iosCount > androidCount && iosCount > 5) return 'ios';
  return 'unknown';
};

// Validate chat file
export const validateChatFile = (content: string): { valid: boolean; error?: string; suggestion?: string } => {
  if (!content || content.trim().length === 0) {
    return {
      valid: false,
      error: 'File is empty',
      suggestion: 'Please upload a valid WhatsApp chat export file.'
    };
  }

  const format = detectChatFormat(content);
  
  if (format === 'unknown') {
    return {
      valid: false,
      error: 'This doesn\'t look like a WhatsApp chat export',
      suggestion: 'Expected format:\n"DD/MM/YYYY, HH:MM - Name: Message"\n\nTo export from WhatsApp:\n1. Open the chat\n2. Tap ⋮ (menu)\n3. More → Export chat\n4. Without media'
    };
  }

  // Check for group chat
  const lines = content.split('\n').slice(0, 200);
  const participants = new Set<string>();
  
  lines.forEach(line => {
    const match = format === 'android'
      ? line.match(/^\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s-\s([^:]+):/)
      : line.match(/^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s([^:]+):/);
    
    if (match && match[1]) {
      participants.add(match[1].trim());
    }
  });

  if (participants.size > 2) {
    return {
      valid: false,
      error: 'Group chat detected',
      suggestion: 'Prismly only supports 1-on-1 chats. Please export a conversation with just one other person.'
    };
  }

  if (participants.size < 2) {
    return {
      valid: false,
      error: 'Could not detect two participants',
      suggestion: 'Make sure this is a conversation between two people.'
    };
  }

  // Count messages
  const messageCount = lines.filter(line => {
    return format === 'android'
      ? /^\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s-\s/.test(line)
      : /^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s/.test(line);
  }).length;

  if (messageCount < 50) {
    return {
      valid: false,
      error: 'Not enough messages for analysis',
      suggestion: `Found only ${messageCount} messages. Prismly needs at least 50 messages to provide meaningful insights.`
    };
  }

  return { valid: true };
};

// Parse Android format
const parseAndroidMessage = (line: string, prevMessage: any) => {
  const pattern = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})\s-\s([^:]+):\s(.*)$/;
  const match = line.match(pattern);
  
  if (match) {
    const [, date, time, sender, message] = match;
    const [day, month, year] = date.split('/').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    const fullYear = year < 100 ? 2000 + year : year;
    const timestamp = new Date(fullYear, month - 1, day, hours, minutes);
    
    return {
      timestamp,
      sender: sender.trim(),
      message: message.trim(),
      isMedia: message.includes('<Media omitted>') || message.includes('image omitted') || message.includes('video omitted')
    };
  }
  
  // Continuation of previous message
  if (prevMessage) {
    return {
      ...prevMessage,
      message: prevMessage.message + '\n' + line
    };
  }
  
  return null;
};

// Parse iOS format
const parseIOSMessage = (line: string, prevMessage: any) => {
  const pattern = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+):\s(.*)$/;
  const match = line.match(pattern);
  
  if (match) {
    const [, date, time, sender, message] = match;
    const [day, month, year] = date.split('/').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    const fullYear = year < 100 ? 2000 + year : year;
    const timestamp = new Date(fullYear, month - 1, day, hours, minutes, seconds);
    
    return {
      timestamp,
      sender: sender.trim(),
      message: message.trim(),
      isMedia: message.includes('<Media omitted>') || message.includes('image omitted') || message.includes('video omitted')
    };
  }
  
  // Continuation of previous message
  if (prevMessage) {
    return {
      ...prevMessage,
      message: prevMessage.message + '\n' + line
    };
  }
  
  return null;
};

// Main parse function with progress callback
export const parseChatFile = async (
  content: string,
  onProgress?: (progress: ParseProgress) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate first
      const validation = validateChatFile(content);
      if (!validation.valid) {
        reject(new Error(validation.error + '\n\n' + validation.suggestion));
        return;
      }

      const format = detectChatFormat(content);
      const lines = content.split('\n');
      const messages: any[] = [];
      let currentMessage: any = null;

      onProgress?.({
        current: 0,
        total: lines.length,
        percentage: 0,
        stage: 'Parsing messages...'
      });

      // Parse in chunks to avoid blocking
      const CHUNK_SIZE = 1000;
      let currentIndex = 0;

      const processChunk = () => {
        const endIndex = Math.min(currentIndex + CHUNK_SIZE, lines.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parsed = format === 'android'
            ? parseAndroidMessage(line, currentMessage)
            : parseIOSMessage(line, currentMessage);

          if (parsed) {
            if (parsed !== currentMessage) {
              // New message
              if (currentMessage) {
                messages.push(currentMessage);
              }
              currentMessage = parsed;
            } else {
              // Updated current message (multi-line)
              currentMessage = parsed;
            }
          }
        }

        currentIndex = endIndex;
        const percentage = Math.round((currentIndex / lines.length) * 100);

        onProgress?.({
          current: currentIndex,
          total: lines.length,
          percentage,
          stage: `Parsing messages... ${messages.length} found`
        });

        if (currentIndex < lines.length) {
          // Continue processing
          setTimeout(processChunk, 0);
        } else {
          // Done
          if (currentMessage) {
            messages.push(currentMessage);
          }

          onProgress?.({
            current: lines.length,
            total: lines.length,
            percentage: 100,
            stage: 'Analyzing data...'
          });

          // Calculate reply times and additional data
          const processedMessages = calculateReplyTimes(messages);
          const chatData = aggregateChatData(processedMessages);

          resolve(chatData);
        }
      };

      processChunk();
    } catch (error) {
      reject(error);
    }
  });
};

// Calculate reply times
const calculateReplyTimes = (messages: any[]) => {
  return messages.map((msg, index) => {
    if (index === 0) return { ...msg, replyTime: 0 };

    const prevMsg = messages[index - 1];
    if (msg.sender !== prevMsg.sender) {
      const timeDiff = (msg.timestamp.getTime() - prevMsg.timestamp.getTime()) / (1000 * 60);
      return { ...msg, replyTime: Math.max(0, timeDiff) };
    }

    return { ...msg, replyTime: 0 };
  });
};

// Aggregate chat data
const aggregateChatData = (messages: any[]) => {
  const participants = [...new Set(messages.map(m => m.sender))];
  
  const messageCountByUser: { [key: string]: number } = {};
  const wordCountByUser: { [key: string]: number } = {};
  let mediaCount = 0;
  const replyTimes: number[] = [];
  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?/gu;
  let totalEmojis = 0;

  participants.forEach(p => {
    messageCountByUser[p] = 0;
    wordCountByUser[p] = 0;
  });

  messages.forEach(msg => {
    messageCountByUser[msg.sender]++;
    
    if (msg.isMedia) {
      mediaCount++;
    } else {
      const words = msg.message.split(/\s+/).filter((w: string) => w.length > 0);
      wordCountByUser[msg.sender] += words.length;
      
      const emojis = msg.message.match(emojiRegex) || [];
      totalEmojis += emojis.length;
    }

    if (msg.replyTime > 0) {
      replyTimes.push(msg.replyTime);
    }
  });

  const avgReplyTime = replyTimes.length > 0
    ? Math.round(replyTimes.reduce((sum, t) => sum + t, 0) / replyTimes.length)
    : 0;

  const messageRatio = participants.length === 2
    ? Math.min(messageCountByUser[participants[0]], messageCountByUser[participants[1]]) /
      Math.max(messageCountByUser[participants[0]], messageCountByUser[participants[1]])
    : 1;

  return {
    messages,
    participants,
    totalMessages: messages.length,
    messageCountByUser,
    wordCountByUser,
    mediaCount,
    avgReplyTime,
    totalEmojis,
    messageRatio,
    consistencyRatio: 0.8, // Placeholder
    replyTimes: [],
    emojiFrequency: [],
    dailyEmojiData: [],
    wordFrequency: [],
    hourlyActivity: [],
    startDate: messages[0]?.timestamp || new Date(),
    endDate: messages[messages.length - 1]?.timestamp || new Date()
  };
};

// File size check
export const checkFileSize = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 100MB. Try exporting a shorter time period or splitting the chat.`
    };
  }
  
  return { valid: true };
};
