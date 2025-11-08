import { Message } from '@/types/chat';

export interface SpaceAnalytics {
  galaxyType: 'spiral' | 'elliptical' | 'irregular';
  galaxyDescription: string;
  age: number; // days
  starCount: number; // total messages
  blackHoles: {
    count: number;
    longestSilence: number; // hours
    averageSilence: number;
  };
  supernovas: {
    count: number;
    biggestBurst: number; // messages in one day
    dates: Date[];
  };
  meteorShowers: {
    count: number;
    intensity: number; // messages per hour during rapid exchanges
    lastOccurrence: Date | null;
  };
}

export const analyzeConversationGalaxy = (messages: Message[]): SpaceAnalytics => {
  if (messages.length === 0) {
    return {
      galaxyType: 'irregular',
      galaxyDescription: 'Forming...',
      age: 0,
      starCount: 0,
      blackHoles: { count: 0, longestSilence: 0, averageSilence: 0 },
      supernovas: { count: 0, biggestBurst: 0, dates: [] },
      meteorShowers: { count: 0, intensity: 0, lastOccurrence: null }
    };
  }

  const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstMessage = sortedMessages[0].timestamp;
  const lastMessage = sortedMessages[sortedMessages.length - 1].timestamp;
  
  // Galaxy Age
  const age = Math.ceil((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60 * 60 * 24));
  
  // Star Count
  const starCount = messages.length;

  // Determine Galaxy Type based on conversation patterns
  const dailyMessages = new Map<string, number>();
  sortedMessages.forEach(msg => {
    const dateStr = msg.timestamp.toISOString().split('T')[0];
    dailyMessages.set(dateStr, (dailyMessages.get(dateStr) || 0) + 1);
  });

  const dailyCounts = Array.from(dailyMessages.values());
  const avgDaily = dailyCounts.reduce((sum, c) => sum + c, 0) / dailyCounts.length;
  const variance = dailyCounts.reduce((sum, c) => sum + Math.pow(c - avgDaily, 2), 0) / dailyCounts.length;
  const stdDev = Math.sqrt(variance);
  const consistency = stdDev / avgDaily;

  let galaxyType: 'spiral' | 'elliptical' | 'irregular';
  let galaxyDescription: string;

  if (consistency < 0.5) {
    galaxyType = 'spiral';
    galaxyDescription = 'Consistent and balanced - a beautiful spiral pattern';
  } else if (consistency < 1.0) {
    galaxyType = 'elliptical';
    galaxyDescription = 'Steady with some variation - an elliptical formation';
  } else {
    galaxyType = 'irregular';
    galaxyDescription = 'Dynamic and unpredictable - an irregular galaxy';
  }

  // Black Holes (silence periods > 24 hours)
  const silencePeriods: number[] = [];
  for (let i = 1; i < sortedMessages.length; i++) {
    const gap = (sortedMessages[i].timestamp.getTime() - sortedMessages[i - 1].timestamp.getTime()) / (1000 * 60 * 60);
    if (gap > 24) {
      silencePeriods.push(gap);
    }
  }

  const blackHoles = {
    count: silencePeriods.length,
    longestSilence: silencePeriods.length > 0 ? Math.max(...silencePeriods) : 0,
    averageSilence: silencePeriods.length > 0 
      ? silencePeriods.reduce((sum, s) => sum + s, 0) / silencePeriods.length 
      : 0
  };

  // Supernovas (days with 3x average messages)
  const supernovaDates: Date[] = [];
  let biggestBurst = 0;

  dailyMessages.forEach((count, dateStr) => {
    if (count > avgDaily * 3) {
      supernovaDates.push(new Date(dateStr));
      biggestBurst = Math.max(biggestBurst, count);
    }
  });

  const supernovas = {
    count: supernovaDates.length,
    biggestBurst: Math.round(biggestBurst),
    dates: supernovaDates
  };

  // Meteor Showers (rapid exchanges: 10+ messages within 1 hour)
  const meteorShowerEvents: { date: Date; intensity: number }[] = [];
  
  for (let i = 0; i < sortedMessages.length - 10; i++) {
    const windowStart = sortedMessages[i].timestamp;
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000); // 1 hour later
    
    let messagesInWindow = 0;
    for (let j = i; j < sortedMessages.length && sortedMessages[j].timestamp <= windowEnd; j++) {
      messagesInWindow++;
    }
    
    if (messagesInWindow >= 10) {
      meteorShowerEvents.push({
        date: windowStart,
        intensity: messagesInWindow
      });
      i += messagesInWindow; // Skip ahead to avoid counting same event multiple times
    }
  }

  const meteorShowers = {
    count: meteorShowerEvents.length,
    intensity: meteorShowerEvents.length > 0 
      ? Math.max(...meteorShowerEvents.map(e => e.intensity)) 
      : 0,
    lastOccurrence: meteorShowerEvents.length > 0 
      ? meteorShowerEvents[meteorShowerEvents.length - 1].date 
      : null
  };

  return {
    galaxyType,
    galaxyDescription,
    age,
    starCount,
    blackHoles,
    supernovas,
    meteorShowers
  };
};
