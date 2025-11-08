import { Message } from '@/types/chat';

// 1. DAILY STATISTICS AGGREGATOR
export interface DailyStats {
  date: string;
  messageCount: number;
  person1Count: number;
  person2Count: number;
  emojiCount: number;
  avgReplyTime: number;
  mediaCount: number;
  activeHours: number;
  firstMessageTime: Date;
  lastMessageTime: Date;
}

export const aggregateDailyStats = (messages: Message[], participants: string[]): DailyStats[] => {
  const dailyMap = new Map<string, {
    messages: Message[];
    person1Count: number;
    person2Count: number;
    emojiCount: number;
    replyTimes: number[];
    mediaCount: number;
    hours: Set<number>;
  }>();

  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  messages.forEach((msg, index) => {
    const dateStr = msg.timestamp.toISOString().split('T')[0];
    
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, {
        messages: [],
        person1Count: 0,
        person2Count: 0,
        emojiCount: 0,
        replyTimes: [],
        mediaCount: 0,
        hours: new Set()
      });
    }

    const dayData = dailyMap.get(dateStr)!;
    dayData.messages.push(msg);
    
    if (msg.sender === participants[0]) dayData.person1Count++;
    else dayData.person2Count++;
    
    const emojis = msg.message.match(emojiRegex) || [];
    dayData.emojiCount += emojis.length;
    
    if (msg.message.includes('<Media omitted>')) dayData.mediaCount++;
    
    dayData.hours.add(msg.timestamp.getHours());
    
    if (index > 0 && msg.replyTime && msg.replyTime > 0) {
      dayData.replyTimes.push(msg.replyTime);
    }
  });

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      messageCount: data.messages.length,
      person1Count: data.person1Count,
      person2Count: data.person2Count,
      emojiCount: data.emojiCount,
      avgReplyTime: data.replyTimes.length > 0 
        ? data.replyTimes.reduce((sum, t) => sum + t, 0) / data.replyTimes.length 
        : 0,
      mediaCount: data.mediaCount,
      activeHours: data.hours.size,
      firstMessageTime: data.messages[0].timestamp,
      lastMessageTime: data.messages[data.messages.length - 1].timestamp
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// 2. TIME-OF-DAY CLASSIFIER
export type TimeOfDay = 'night' | 'morning' | 'afternoon' | 'evening';

export const classifyTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 0 && hour <= 5) return 'night';
  if (hour >= 6 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 17) return 'afternoon';
  return 'evening';
};

// 3. CONVERSATION STARTER TRACKER
export interface ConversationStarter {
  [personName: string]: { count: number; percentage: number };
  totalConversations: number;
  leader: string;
}

export const getConversationStarters = (messages: Message[], participants: string[]): ConversationStarter => {
  const sessions: Message[][] = [];
  let currentSession: Message[] = [];
  const GAP_THRESHOLD = 60; // 1 hour in minutes

  messages.forEach((msg, index) => {
    if (index === 0) {
      currentSession = [msg];
    } else {
      const prevMsg = messages[index - 1];
      const timeDiff = (msg.timestamp.getTime() - prevMsg.timestamp.getTime()) / (1000 * 60);
      
      if (timeDiff > GAP_THRESHOLD) {
        if (currentSession.length > 0) sessions.push(currentSession);
        currentSession = [msg];
      } else {
        currentSession.push(msg);
      }
    }
  });
  
  if (currentSession.length > 0) sessions.push(currentSession);

  const starterCounts: { [key: string]: number } = {};
  participants.forEach(p => starterCounts[p] = 0);

  sessions.forEach(session => {
    if (session.length > 0) {
      starterCounts[session[0].sender]++;
    }
  });

  const totalConversations = sessions.length;
  const result: ConversationStarter = {
    totalConversations,
    leader: participants[0]
  };

  participants.forEach(p => {
    const count = starterCounts[p] || 0;
    result[p] = {
      count,
      percentage: totalConversations > 0 ? (count / totalConversations) * 100 : 0
    };
    
    if (count > starterCounts[result.leader]) {
      result.leader = p;
    }
  });

  return result;
};

// 4. EMOJI OVERLAP ANALYZER
export interface EmojiCompatibility {
  compatibilityScore: number;
  sharedEmojis: string[];
  person1Only: string[];
  person2Only: string[];
  totalUnique: number;
  sharedCount: number;
}

export const calculateEmojiCompatibility = (messages: Message[], person1: string, person2: string): EmojiCompatibility => {
  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  
  const person1Emojis = new Set<string>();
  const person2Emojis = new Set<string>();

  messages.forEach(msg => {
    const emojis = msg.message.match(emojiRegex) || [];
    const filteredEmojis = emojis.filter(e => !/^[\u{1F3FB}-\u{1F3FF}]$/u.test(e));
    
    if (msg.sender === person1) {
      filteredEmojis.forEach(e => person1Emojis.add(e));
    } else if (msg.sender === person2) {
      filteredEmojis.forEach(e => person2Emojis.add(e));
    }
  });

  const sharedEmojis = Array.from(person1Emojis).filter(e => person2Emojis.has(e));
  const person1Only = Array.from(person1Emojis).filter(e => !person2Emojis.has(e));
  const person2Only = Array.from(person2Emojis).filter(e => !person1Emojis.has(e));
  
  const totalUnique = new Set([...person1Emojis, ...person2Emojis]).size;
  const sharedCount = sharedEmojis.length;
  const compatibilityScore = totalUnique > 0 ? (sharedCount / totalUnique) * 100 : 0;

  return {
    compatibilityScore,
    sharedEmojis,
    person1Only,
    person2Only,
    totalUnique,
    sharedCount
  };
};

// 5. PEAK ACTIVITY DETECTOR
export type ActivityType = 'night_owl' | 'early_bird' | 'day_person';

export interface PeakActivity {
  person1: { peakHour: number; messageCount: number; type: ActivityType; label: string };
  person2: { peakHour: number; messageCount: number; type: ActivityType; label: string };
  sharedPeakHours: number[];
  overlapScore: number;
}

export const detectPeakActivity = (messages: Message[], participants: string[]): PeakActivity => {
  const hourlyActivity: { [person: string]: { [hour: number]: number } } = {
    [participants[0]]: {},
    [participants[1]]: {}
  };

  // Initialize hours
  for (let h = 0; h < 24; h++) {
    hourlyActivity[participants[0]][h] = 0;
    hourlyActivity[participants[1]][h] = 0;
  }

  // Count messages per hour per person
  messages.forEach(msg => {
    const hour = msg.timestamp.getHours();
    if (hourlyActivity[msg.sender]) {
      hourlyActivity[msg.sender][hour]++;
    }
  });

  const getPersonStats = (person: string) => {
    const hours = hourlyActivity[person];
    let peakHour = 0;
    let maxCount = 0;

    Object.entries(hours).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    });

    let type: ActivityType;
    let label: string;

    if ((peakHour >= 20 && peakHour <= 23) || (peakHour >= 0 && peakHour <= 5)) {
      type = 'night_owl';
      label = '🦉 Night Owl';
    } else if (peakHour >= 6 && peakHour <= 10) {
      type = 'early_bird';
      label = '🐦 Early Bird';
    } else {
      type = 'day_person';
      label = '☀️ Day Person';
    }

    return { peakHour, messageCount: maxCount, type, label };
  };

  const person1Stats = getPersonStats(participants[0]);
  const person2Stats = getPersonStats(participants[1]);

  // Find shared peak hours (both have significant activity)
  const sharedPeakHours: number[] = [];
  const threshold = 0.3; // 30% of their peak

  for (let h = 0; h < 24; h++) {
    const p1Count = hourlyActivity[participants[0]][h];
    const p2Count = hourlyActivity[participants[1]][h];
    
    if (p1Count >= person1Stats.messageCount * threshold && 
        p2Count >= person2Stats.messageCount * threshold) {
      sharedPeakHours.push(h);
    }
  }

  // Calculate overlap score
  let overlapSum = 0;
  for (let h = 0; h < 24; h++) {
    const p1Count = hourlyActivity[participants[0]][h];
    const p2Count = hourlyActivity[participants[1]][h];
    overlapSum += Math.min(p1Count, p2Count);
  }
  
  const totalMessages = messages.length;
  const overlapScore = totalMessages > 0 ? (overlapSum / totalMessages) * 100 : 0;

  return {
    person1: person1Stats,
    person2: person2Stats,
    sharedPeakHours,
    overlapScore
  };
};

// 6. MESSAGE LENGTH ANALYZER
export interface MessageLengthStats {
  [personName: string]: { 
    avgChars: number; 
    avgWords: number; 
    longest: number; 
    shortest: number;
    longestMessage?: Message;
  };
  overall: { avgChars: number; avgWords: number };
}

export const analyzeMessageLength = (messages: Message[], participants: string[]): MessageLengthStats => {
  const stats: { [person: string]: { chars: number[]; words: number[]; messages: Message[] } } = {};
  
  participants.forEach(p => {
    stats[p] = { chars: [], words: [], messages: [] };
  });

  messages.forEach(msg => {
    // Skip media-only messages
    if (msg.message === '<Media omitted>' || msg.message.trim().length === 0) return;
    
    const charCount = msg.message.length;
    const wordCount = msg.message.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    if (stats[msg.sender]) {
      stats[msg.sender].chars.push(charCount);
      stats[msg.sender].words.push(wordCount);
      stats[msg.sender].messages.push(msg);
    }
  });

  const result: MessageLengthStats = {
    overall: { avgChars: 0, avgWords: 0 }
  };

  let totalChars = 0;
  let totalWords = 0;
  let totalMessages = 0;

  participants.forEach(person => {
    const personStats = stats[person];
    const charArray = personStats.chars;
    const wordArray = personStats.words;
    const messageArray = personStats.messages;

    if (charArray.length > 0) {
      const avgChars = charArray.reduce((sum, c) => sum + c, 0) / charArray.length;
      const avgWords = wordArray.reduce((sum, w) => sum + w, 0) / wordArray.length;
      const longest = Math.max(...charArray);
      const shortest = Math.min(...charArray);
      
      // Find the actual longest message
      const longestIndex = charArray.indexOf(longest);
      const longestMessage = messageArray[longestIndex];

      result[person] = {
        avgChars: Math.round(avgChars),
        avgWords: Math.round(avgWords * 10) / 10,
        longest,
        shortest,
        longestMessage
      };

      totalChars += charArray.reduce((sum, c) => sum + c, 0);
      totalWords += wordArray.reduce((sum, w) => sum + w, 0);
      totalMessages += charArray.length;
    } else {
      result[person] = { avgChars: 0, avgWords: 0, longest: 0, shortest: 0 };
    }
  });

  if (totalMessages > 0) {
    result.overall = {
      avgChars: Math.round(totalChars / totalMessages),
      avgWords: Math.round((totalWords / totalMessages) * 10) / 10
    };
  }

  return result;
};

// 7. STREAK CALCULATOR
export interface StreakData {
  longestStreak: number;
  longestStreakStart: Date;
  longestStreakEnd: Date;
  currentStreak: number;
  currentStreakStart: Date | null;
  totalStreaks: number;
  averageStreakLength: number;
  activeDays: number;
  totalDays: number;
  activityPercentage: number;
}

export const calculateStreaks = (messages: Message[]): StreakData => {
  if (messages.length === 0) {
    return {
      longestStreak: 0,
      longestStreakStart: new Date(),
      longestStreakEnd: new Date(),
      currentStreak: 0,
      currentStreakStart: null,
      totalStreaks: 0,
      averageStreakLength: 0,
      activeDays: 0,
      totalDays: 0,
      activityPercentage: 0
    };
  }

  // Get unique days with messages
  const activeDaysSet = new Set<string>();
  messages.forEach(msg => {
    const dateStr = msg.timestamp.toISOString().split('T')[0];
    activeDaysSet.add(dateStr);
  });

  const activeDaysArray = Array.from(activeDaysSet).sort();
  const activeDays = activeDaysArray.length;

  // Calculate total days from first to last message
  const firstDate = new Date(activeDaysArray[0]);
  const lastDate = new Date(activeDaysArray[activeDaysArray.length - 1]);
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Find streaks
  let longestStreak = 1;
  let longestStreakStart = new Date(activeDaysArray[0]);
  let longestStreakEnd = new Date(activeDaysArray[0]);
  let currentStreakLength = 1;
  let currentStreakStartDate = new Date(activeDaysArray[0]);
  let totalStreaks = 0;
  let totalStreakDays = 0;

  for (let i = 1; i < activeDaysArray.length; i++) {
    const prevDate = new Date(activeDaysArray[i - 1]);
    const currDate = new Date(activeDaysArray[i]);
    const dayDiff = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive day
      currentStreakLength++;
    } else {
      // Streak broken
      if (currentStreakLength >= 1) {
        totalStreaks++;
        totalStreakDays += currentStreakLength;
      }
      
      if (currentStreakLength > longestStreak) {
        longestStreak = currentStreakLength;
        longestStreakStart = currentStreakStartDate;
        longestStreakEnd = new Date(activeDaysArray[i - 1]);
      }
      
      currentStreakLength = 1;
      currentStreakStartDate = currDate;
    }
  }

  // Check final streak
  if (currentStreakLength >= 1) {
    totalStreaks++;
    totalStreakDays += currentStreakLength;
  }
  
  if (currentStreakLength > longestStreak) {
    longestStreak = currentStreakLength;
    longestStreakStart = currentStreakStartDate;
    longestStreakEnd = new Date(activeDaysArray[activeDaysArray.length - 1]);
  }

  // Check if current streak is active (last message was today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActiveDate = new Date(activeDaysArray[activeDaysArray.length - 1]);
  lastActiveDate.setHours(0, 0, 0, 0);
  const daysSinceLastMessage = Math.ceil((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

  let currentStreak = 0;
  let currentStreakStart: Date | null = null;

  if (daysSinceLastMessage <= 1) {
    currentStreak = currentStreakLength;
    currentStreakStart = currentStreakStartDate;
  }

  const averageStreakLength = totalStreaks > 0 ? totalStreakDays / totalStreaks : 0;
  const activityPercentage = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;

  return {
    longestStreak,
    longestStreakStart,
    longestStreakEnd,
    currentStreak,
    currentStreakStart,
    totalStreaks,
    averageStreakLength: Math.round(averageStreakLength * 10) / 10,
    activeDays,
    totalDays,
    activityPercentage: Math.round(activityPercentage * 10) / 10
  };
};
