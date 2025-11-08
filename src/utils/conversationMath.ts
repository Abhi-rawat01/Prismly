import { Message } from '@/types/chat';

export interface ConversationMathematics {
  timeStats: {
    totalHours: number;
    totalDays: number;
    bookPages: number;
    readingHours: number;
  };
  valueCalculations: {
    tweetValue: number;
    therapyValue: number;
    adImpressions: number;
  };
  distanceStats: {
    totalCharacters: number;
    novelEquivalent: number;
    textLength: number; // in km
    messageFrequency: number; // hours between messages
  };
  probabilityStats: {
    simultaneousMessageOdds: string;
    subMinuteReplyChance: number;
    emojiLikelihood: number;
  };
}

export const calculateConversationMath = (messages: Message[]): ConversationMathematics => {
  if (messages.length === 0) {
    return {
      timeStats: { totalHours: 0, totalDays: 0, bookPages: 0, readingHours: 0 },
      valueCalculations: { tweetValue: 0, therapyValue: 0, adImpressions: 0 },
      distanceStats: { totalCharacters: 0, novelEquivalent: 0, textLength: 0, messageFrequency: 0 },
      probabilityStats: { simultaneousMessageOdds: '0', subMinuteReplyChance: 0, emojiLikelihood: 0 }
    };
  }

  // Calculate total characters
  const totalCharacters = messages.reduce((sum, msg) => {
    return sum + (msg.message === '<Media omitted>' ? 0 : msg.message.length);
  }, 0);

  // Time Statistics
  const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstMessage = sortedMessages[0].timestamp;
  const lastMessage = sortedMessages[sortedMessages.length - 1].timestamp;
  const totalMilliseconds = lastMessage.getTime() - firstMessage.getTime();
  const totalHours = Math.round(totalMilliseconds / (1000 * 60 * 60));
  const totalDays = Math.round((totalHours / 24) * 10) / 10;

  // Book pages (average 250 words per page, 5 chars per word)
  const bookPages = Math.round(totalCharacters / (250 * 5));

  // Reading time (average 200 words per minute, 5 chars per word)
  const readingHours = Math.round((totalCharacters / (200 * 5 * 60)) * 10) / 10;

  // Value Calculations
  // Tweet value: $0.50 per tweet (280 chars), market value estimate
  const tweetEquivalent = Math.floor(totalCharacters / 280);
  const tweetValue = Math.round(tweetEquivalent * 0.5);

  // Therapy value: $100/hour, assuming 1 hour per 1000 messages
  const therapyHours = Math.round(messages.length / 1000);
  const therapyValue = therapyHours * 100;

  // Ad impressions: 1 message = 10 impressions (rough estimate)
  const adImpressions = messages.length * 10;

  // Distance Statistics
  // Novel equivalent: average novel is 80,000 words = 400,000 characters
  const novelEquivalent = Math.round((totalCharacters / 400000) * 10) / 10;

  // Text length in km: average character width 2mm
  const textLength = Math.round((totalCharacters * 0.002) / 1000 * 10) / 10;

  // Message frequency: hours between messages
  const messageFrequency = totalHours > 0 ? Math.round((totalHours / messages.length) * 10) / 10 : 0;

  // Probability Statistics
  // Simultaneous messages: messages sent within 1 minute of each other
  let simultaneousCount = 0;
  for (let i = 1; i < sortedMessages.length; i++) {
    const timeDiff = (sortedMessages[i].timestamp.getTime() - sortedMessages[i - 1].timestamp.getTime()) / 1000;
    if (timeDiff <= 60 && sortedMessages[i].sender !== sortedMessages[i - 1].sender) {
      simultaneousCount++;
    }
  }
  const simultaneousOdds = messages.length > 0 ? Math.round(messages.length / Math.max(simultaneousCount, 1)) : 0;

  // Sub-minute reply chance
  const subMinuteReplies = messages.filter(m => m.replyTime && m.replyTime < 1).length;
  const totalReplies = messages.filter(m => m.replyTime && m.replyTime > 0).length;
  const subMinuteReplyChance = totalReplies > 0 ? Math.round((subMinuteReplies / totalReplies) * 100) : 0;

  // Emoji likelihood
  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?/gu;
  const messagesWithEmojis = messages.filter(m => emojiRegex.test(m.message)).length;
  const emojiLikelihood = messages.length > 0 ? Math.round((messagesWithEmojis / messages.length) * 100) : 0;

  return {
    timeStats: {
      totalHours,
      totalDays,
      bookPages,
      readingHours
    },
    valueCalculations: {
      tweetValue,
      therapyValue,
      adImpressions
    },
    distanceStats: {
      totalCharacters,
      novelEquivalent,
      textLength,
      messageFrequency
    },
    probabilityStats: {
      simultaneousMessageOdds: `1 in ${simultaneousOdds}`,
      subMinuteReplyChance,
      emojiLikelihood
    }
  };
};
