import { Message } from '@/types/chat';

export interface Season {
  name: string;
  period: string;
  startDate: Date;
  endDate: Date;
  duration: number; // days
  stats: {
    totalMessages: number;
    avgMessagesPerDay: number;
    avgReplyTime: number;
    emojiCount: number;
    avgMessageLength: number;
    longestStreak: number;
  };
  characteristics: string[];
  icon: string;
  color: string;
}

export interface SeasonAnalysis {
  seasons: Season[];
  currentSeason: Season;
  goldenPeriod: Season | null;
  timeline: {
    date: Date;
    season: string;
    activity: number;
  }[];
}

// Detect conversation seasons
export const detectConversationSeasons = (messages: Message[]): SeasonAnalysis => {
  if (messages.length === 0) {
    return {
      seasons: [],
      currentSeason: createEmptySeason(),
      goldenPeriod: null,
      timeline: []
    };
  }

  const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstDate = sortedMessages[0].timestamp;
  const lastDate = sortedMessages[sortedMessages.length - 1].timestamp;
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  const seasons: Season[] = [];

  // Early Days (first 3 months or 25% of conversation)
  const earlyDays = Math.min(90, Math.floor(totalDays * 0.25));
  if (earlyDays > 0) {
    const earlyEndDate = new Date(firstDate.getTime() + earlyDays * 24 * 60 * 60 * 1000);
    const earlyMessages = sortedMessages.filter(m => m.timestamp <= earlyEndDate);
    
    if (earlyMessages.length > 0) {
      seasons.push(createSeason(
        'Early Days',
        '🌱',
        'from-green-400 to-emerald-500',
        firstDate,
        earlyEndDate,
        earlyMessages,
        ['Getting to know each other', 'Building connection', 'Exploring interests']
      ));
    }
  }

  // Middle periods - detect peaks
  if (totalDays > 180) {
    const middleStart = new Date(firstDate.getTime() + earlyDays * 24 * 60 * 60 * 1000);
    const recentStart = new Date(lastDate.getTime() - 90 * 24 * 60 * 60 * 1000);
    const middleMessages = sortedMessages.filter(m => m.timestamp > middleStart && m.timestamp < recentStart);

    if (middleMessages.length > 0) {
      // Split middle into chunks and find peak
      const chunkSize = 30; // 30-day chunks
      const chunks = splitIntoChunks(middleMessages, chunkSize);
      
      let peakChunk = chunks[0];
      let maxActivity = 0;

      chunks.forEach(chunk => {
        const activity = chunk.messages.length / chunk.days;
        if (activity > maxActivity) {
          maxActivity = activity;
          peakChunk = chunk;
        }
      });

      if (peakChunk && peakChunk.messages.length > 0) {
        seasons.push(createSeason(
          'Golden Period',
          '✨',
          'from-yellow-400 to-orange-500',
          peakChunk.startDate,
          peakChunk.endDate,
          peakChunk.messages,
          ['Peak activity', 'Strongest connection', 'Most engaged']
        ));
      }
    }
  }

  // Current Phase (last 3 months or 25% of conversation)
  const currentDays = Math.min(90, Math.floor(totalDays * 0.25));
  const currentStartDate = new Date(lastDate.getTime() - currentDays * 24 * 60 * 60 * 1000);
  const currentMessages = sortedMessages.filter(m => m.timestamp >= currentStartDate);

  if (currentMessages.length > 0) {
    const currentSeason = createSeason(
      'Current Phase',
      '🎯',
      'from-blue-400 to-cyan-500',
      currentStartDate,
      lastDate,
      currentMessages,
      determineCurrentCharacteristics(currentMessages, seasons[0])
    );
    seasons.push(currentSeason);
  }

  // Find golden period
  const goldenPeriod = seasons.find(s => s.name === 'Golden Period') || null;

  // Create timeline
  const timeline = createTimeline(sortedMessages, seasons);

  return {
    seasons,
    currentSeason: seasons[seasons.length - 1] || createEmptySeason(),
    goldenPeriod,
    timeline
  };
};

// Create a season from messages
const createSeason = (
  name: string,
  icon: string,
  color: string,
  startDate: Date,
  endDate: Date,
  messages: Message[],
  characteristics: string[]
): Season => {
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const avgMessagesPerDay = messages.length / duration;

  // Calculate reply times
  const replyTimes = messages
    .filter(m => m.replyTime && m.replyTime > 0)
    .map(m => m.replyTime || 0);
  const avgReplyTime = replyTimes.length > 0
    ? replyTimes.reduce((sum, t) => sum + t, 0) / replyTimes.length
    : 0;

  // Count emojis
  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?/gu;
  const emojiCount = messages.reduce((sum, m) => {
    const emojis = m.message.match(emojiRegex) || [];
    return sum + emojis.length;
  }, 0);

  // Calculate average message length
  const validMessages = messages.filter(m => m.message !== '<Media omitted>');
  const avgMessageLength = validMessages.length > 0
    ? validMessages.reduce((sum, m) => sum + m.message.length, 0) / validMessages.length
    : 0;

  // Calculate longest streak
  const longestStreak = calculateLongestStreak(messages);

  return {
    name,
    period: formatPeriod(startDate, endDate),
    startDate,
    endDate,
    duration,
    stats: {
      totalMessages: messages.length,
      avgMessagesPerDay: Math.round(avgMessagesPerDay * 10) / 10,
      avgReplyTime: Math.round(avgReplyTime),
      emojiCount,
      avgMessageLength: Math.round(avgMessageLength),
      longestStreak
    },
    characteristics,
    icon,
    color
  };
};

// Split messages into chunks
const splitIntoChunks = (messages: Message[], chunkDays: number) => {
  if (messages.length === 0) return [];

  const chunks: { startDate: Date; endDate: Date; messages: Message[]; days: number }[] = [];
  const firstDate = messages[0].timestamp;
  const lastDate = messages[messages.length - 1].timestamp;
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < totalDays; i += chunkDays) {
    const chunkStart = new Date(firstDate.getTime() + i * 24 * 60 * 60 * 1000);
    const chunkEnd = new Date(Math.min(
      chunkStart.getTime() + chunkDays * 24 * 60 * 60 * 1000,
      lastDate.getTime()
    ));

    const chunkMessages = messages.filter(m => m.timestamp >= chunkStart && m.timestamp <= chunkEnd);
    const actualDays = Math.ceil((chunkEnd.getTime() - chunkStart.getTime()) / (1000 * 60 * 60 * 24));

    if (chunkMessages.length > 0) {
      chunks.push({
        startDate: chunkStart,
        endDate: chunkEnd,
        messages: chunkMessages,
        days: actualDays
      });
    }
  }

  return chunks;
};

// Calculate longest streak in a period
const calculateLongestStreak = (messages: Message[]): number => {
  const activeDays = new Set<string>();
  messages.forEach(m => {
    const dateStr = m.timestamp.toISOString().split('T')[0];
    activeDays.add(dateStr);
  });

  const sortedDays = Array.from(activeDays).sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1]);
    const currDate = new Date(sortedDays[i]);
    const dayDiff = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

// Determine current phase characteristics
const determineCurrentCharacteristics = (currentMessages: Message[], earlyPhase?: Season): string[] => {
  const characteristics: string[] = [];

  if (!earlyPhase) return ['Ongoing conversation', 'Current dynamics'];

  const currentAvg = currentMessages.length / 90;
  const earlyAvg = earlyPhase.stats.avgMessagesPerDay;

  if (currentAvg > earlyAvg * 1.2) {
    characteristics.push('More active than early days');
  } else if (currentAvg < earlyAvg * 0.8) {
    characteristics.push('Calmer pace than before');
  } else {
    characteristics.push('Consistent communication');
  }

  // Check emoji usage
  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?/gu;
  const currentEmojis = currentMessages.reduce((sum, m) => {
    const emojis = m.message.match(emojiRegex) || [];
    return sum + emojis.length;
  }, 0);
  const currentEmojiRate = currentEmojis / currentMessages.length;
  const earlyEmojiRate = earlyPhase.stats.emojiCount / earlyPhase.stats.totalMessages;

  if (currentEmojiRate > earlyEmojiRate * 1.2) {
    characteristics.push('More expressive');
  }

  characteristics.push('Present moment');

  return characteristics;
};

// Format period
const formatPeriod = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  
  if (startStr === endStr) return startStr;
  return `${startStr} - ${endStr}`;
};

// Create timeline
const createTimeline = (messages: Message[], seasons: Season[]) => {
  const timeline: { date: Date; season: string; activity: number }[] = [];
  
  if (messages.length === 0) return timeline;

  const firstDate = messages[0].timestamp;
  const lastDate = messages[messages.length - 1].timestamp;
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  // Create weekly data points
  const weeklyPoints = Math.min(52, Math.ceil(totalDays / 7));

  for (let i = 0; i < weeklyPoints; i++) {
    const weekStart = new Date(firstDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const weekMessages = messages.filter(m => m.timestamp >= weekStart && m.timestamp < weekEnd);
    const activity = weekMessages.length;

    // Find which season this week belongs to
    const season = seasons.find(s => weekStart >= s.startDate && weekStart <= s.endDate);

    timeline.push({
      date: weekStart,
      season: season?.name || 'Unknown',
      activity
    });
  }

  return timeline;
};

// Create empty season
const createEmptySeason = (): Season => ({
  name: 'No Data',
  period: '',
  startDate: new Date(),
  endDate: new Date(),
  duration: 0,
  stats: {
    totalMessages: 0,
    avgMessagesPerDay: 0,
    avgReplyTime: 0,
    emojiCount: 0,
    avgMessageLength: 0,
    longestStreak: 0
  },
  characteristics: [],
  icon: '📊',
  color: 'from-gray-400 to-gray-500'
});
