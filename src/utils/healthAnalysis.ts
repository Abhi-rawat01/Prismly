import { Message } from '@/types/chat';
import { RelationshipType } from '@/components/RelationshipTypeSelector';

// Health Analysis Types
export type Severity = 'healthy' | 'warning' | 'critical';
export type Trend = 'worsening' | 'stable' | 'improving';
export type Direction = 'increasing' | 'stable' | 'declining' | 'faster' | 'slower';

export interface HealthFlag {
  type: string;
  detected: boolean;
  severity: Severity;
  title: string;
  description: string;
  icon: string;
  metrics: any;
  affectedPerson: string | null;
  trend: Trend;
  recommendations: string[];
}

export interface PositivePattern {
  type: string;
  title: string;
  description: string;
  icon: string;
}

export interface HealthAnalysis {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  healthScore: number;
  flags: HealthFlag[];
  positivePatterns: PositivePattern[];
  trends: {
    messageFrequency: { direction: Direction; percentage: number };
    responseTime: { direction: Direction; percentage: number };
    engagement: { direction: Direction; percentage: number };
    balance: { direction: Direction; currentRatio: number };
  };
  summary: {
    totalFlags: number;
    criticalFlags: number;
    warningFlags: number;
    positivePatterns: number;
  };
}

// Helper: Split messages into time periods
const splitByTimePeriod = (messages: Message[]) => {
  if (messages.length === 0) return { early: [], recent: [] };

  const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstDate = sortedMessages[0].timestamp;
  const lastDate = sortedMessages[sortedMessages.length - 1].timestamp;
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  let earlyDays: number, recentDays: number;

  if (totalDays < 90) {
    // Split in half
    const midpoint = Math.floor(sortedMessages.length / 2);
    return {
      early: sortedMessages.slice(0, midpoint),
      recent: sortedMessages.slice(midpoint)
    };
  } else if (totalDays <= 365) {
    // First 30 vs last 30 days
    earlyDays = 30;
    recentDays = 30;
  } else {
    // First 90 vs last 90 days
    earlyDays = 90;
    recentDays = 90;
  }

  const earlyEndDate = new Date(firstDate.getTime() + earlyDays * 24 * 60 * 60 * 1000);
  const recentStartDate = new Date(lastDate.getTime() - recentDays * 24 * 60 * 60 * 1000);

  return {
    early: sortedMessages.filter(m => m.timestamp <= earlyEndDate),
    recent: sortedMessages.filter(m => m.timestamp >= recentStartDate)
  };
};

// 1. ONE-SIDED COMMUNICATION
const detectOneSidedCommunication = (
  messages: Message[],
  participants: string[],
  relationshipType: RelationshipType
): HealthFlag => {
  const person1Count = messages.filter(m => m.sender === participants[0]).length;
  const person2Count = messages.filter(m => m.sender === participants[1]).length;
  const total = messages.length;

  const person1Percentage = (person1Count / total) * 100;
  const person2Percentage = (person2Count / total) * 100;
  const imbalanceRatio = Math.max(person1Percentage, person2Percentage) / Math.min(person1Percentage, person2Percentage);

  // Adjust thresholds based on relationship type
  const thresholds = relationshipType === 'professional' || relationshipType === 'family'
    ? { warning: [25, 75], critical: [20, 80] }
    : { warning: [30, 70], critical: [25, 75] };

  let severity: Severity = 'healthy';
  let detected = false;

  if (person1Percentage < thresholds.critical[0] || person1Percentage > thresholds.critical[1]) {
    severity = 'critical';
    detected = true;
  } else if (person1Percentage < thresholds.warning[0] || person1Percentage > thresholds.warning[1]) {
    severity = 'warning';
    detected = true;
  }

  const affectedPerson = person1Percentage < person2Percentage ? participants[0] : participants[1];
  const lessActivePercentage = Math.min(person1Percentage, person2Percentage);

  return {
    type: 'one_sided_communication',
    detected,
    severity,
    title: 'Message Balance',
    description: detected
      ? `We noticed ${affectedPerson.split(' ')[0]} sends fewer messages (${lessActivePercentage.toFixed(0)}%). This might mean they're busier or prefer different communication styles.`
      : 'Message distribution looks balanced between both participants.',
    icon: '⚖️',
    metrics: {
      person1Percentage: person1Percentage.toFixed(1),
      person2Percentage: person2Percentage.toFixed(1),
      imbalanceRatio: imbalanceRatio.toFixed(2)
    },
    affectedPerson: detected ? affectedPerson : null,
    trend: 'stable',
    recommendations: detected ? [
      `Encourage ${affectedPerson.split(' ')[0]} to share more about their day`,
      'Try asking more open-ended questions',
      `${affectedPerson.split(' ')[0]} might be busy - check in about their availability`,
      'Different communication styles are normal - find what works for both'
    ] : []
  };
};

// 2. DECLINING MESSAGE FREQUENCY
const detectDecliningFrequency = (messages: Message[]): HealthFlag => {
  const { early, recent } = splitByTimePeriod(messages);

  if (early.length === 0 || recent.length === 0) {
    return {
      type: 'declining_frequency',
      detected: false,
      severity: 'healthy',
      title: 'Message Frequency',
      description: 'Not enough data to analyze frequency trends.',
      icon: '📊',
      metrics: {},
      affectedPerson: null,
      trend: 'stable',
      recommendations: []
    };
  }

  const earlyDays = Math.ceil((early[early.length - 1].timestamp.getTime() - early[0].timestamp.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const recentDays = Math.ceil((recent[recent.length - 1].timestamp.getTime() - recent[0].timestamp.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const earlyAverage = early.length / earlyDays;
  const recentAverage = recent.length / recentDays;
  const changePercentage = ((recentAverage - earlyAverage) / earlyAverage) * 100;

  let severity: Severity = 'healthy';
  let detected = false;

  if (changePercentage < -40) {
    severity = 'critical';
    detected = true;
  } else if (changePercentage < -15) {
    severity = 'warning';
    detected = true;
  }

  return {
    type: 'declining_frequency',
    detected,
    severity,
    title: 'Conversation Frequency',
    description: detected
      ? `Message frequency has ${Math.abs(changePercentage).toFixed(0)}% decreased recently. Life gets busy! Consider scheduling regular check-ins.`
      : changePercentage > 15
      ? `Great news! Message frequency has increased by ${changePercentage.toFixed(0)}%.`
      : 'Message frequency is stable.',
    icon: '📉',
    metrics: {
      earlyAverage: earlyAverage.toFixed(1),
      recentAverage: recentAverage.toFixed(1),
      changePercentage: changePercentage.toFixed(1)
    },
    affectedPerson: null,
    trend: changePercentage < -15 ? 'worsening' : changePercentage > 15 ? 'improving' : 'stable',
    recommendations: detected ? [
      'Life gets busy - try scheduling regular catch-ups',
      'Initiate conversations about shared interests',
      'Check if anything has changed that affects communication',
      'Quality matters more than quantity'
    ] : []
  };
};

// 3. INCREASING RESPONSE TIMES
const detectSlowingResponses = (
  messages: Message[],
  participants: string[],
  relationshipType: RelationshipType
): HealthFlag => {
  const { early, recent } = splitByTimePeriod(messages);

  const calculateAvgReplyTime = (msgs: Message[], person: string) => {
    const replies = msgs.filter(m => m.sender === person && m.replyTime && m.replyTime > 0);
    if (replies.length === 0) return 0;
    return replies.reduce((sum, m) => sum + (m.replyTime || 0), 0) / replies.length;
  };

  const person1Early = calculateAvgReplyTime(early, participants[0]);
  const person1Recent = calculateAvgReplyTime(recent, participants[0]);
  const person2Early = calculateAvgReplyTime(early, participants[1]);
  const person2Recent = calculateAvgReplyTime(recent, participants[1]);

  const person1Change = person1Early > 0 ? ((person1Recent - person1Early) / person1Early) * 100 : 0;
  const person2Change = person2Early > 0 ? ((person2Recent - person2Early) / person2Early) * 100 : 0;

  const maxChange = Math.max(person1Change, person2Change);
  const isCritical = relationshipType === 'professional' ? 75 : 100;

  let severity: Severity = 'healthy';
  let detected = false;
  let affectedPerson: string | null = null;

  if (maxChange > isCritical) {
    severity = 'critical';
    detected = true;
  } else if (maxChange > 50) {
    severity = 'warning';
    detected = true;
  }

  if (detected) {
    if (person1Change > person2Change) {
      affectedPerson = participants[0];
    } else if (person2Change > person1Change) {
      affectedPerson = participants[1];
    } else {
      affectedPerson = 'both';
    }
  }

  return {
    type: 'slowing_responses',
    detected,
    severity,
    title: 'Response Times',
    description: detected
      ? `Response times have increased by ${maxChange.toFixed(0)}%. ${affectedPerson === 'both' ? 'Both' : affectedPerson?.split(' ')[0]} might be busier lately.`
      : maxChange < -20
      ? 'Response times are getting faster - great engagement!'
      : 'Response times are consistent.',
    icon: '⏱️',
    metrics: {
      person1: {
        earlyAverage: person1Early.toFixed(1),
        recentAverage: person1Recent.toFixed(1),
        changePercentage: person1Change.toFixed(1)
      },
      person2: {
        earlyAverage: person2Early.toFixed(1),
        recentAverage: person2Recent.toFixed(1),
        changePercentage: person2Change.toFixed(1)
      }
    },
    affectedPerson,
    trend: maxChange > 50 ? 'worsening' : maxChange < -20 ? 'improving' : 'stable',
    recommendations: detected ? [
      'Different schedules? Try asynchronous communication',
      `${affectedPerson === 'both' ? 'Both might' : affectedPerson?.split(' ')[0] + ' might'} be busier - be patient`,
      'Set expectations about response times',
      'Consider time zones and work schedules'
    ] : []
  };
};

// 4. EMOTIONAL DISENGAGEMENT
const detectEmotionalDisengagement = (
  messages: Message[],
  participants: string[],
  relationshipType: RelationshipType
): HealthFlag => {
  const { early, recent } = splitByTimePeriod(messages);

  const emojiRegex = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])[\u{1F3FB}-\u{1F3FF}]?/gu;

  const analyzeEngagement = (msgs: Message[], person: string) => {
    const personMsgs = msgs.filter(m => m.sender === person && m.message !== '<Media omitted>');
    if (personMsgs.length === 0) return { avgEmojis: 0, avgLength: 0 };

    const totalEmojis = personMsgs.reduce((sum, m) => {
      const emojis = m.message.match(emojiRegex) || [];
      return sum + emojis.length;
    }, 0);

    const totalLength = personMsgs.reduce((sum, m) => sum + m.message.length, 0);

    return {
      avgEmojis: totalEmojis / personMsgs.length,
      avgLength: totalLength / personMsgs.length
    };
  };

  const person1Early = analyzeEngagement(early, participants[0]);
  const person1Recent = analyzeEngagement(recent, participants[0]);
  const person2Early = analyzeEngagement(early, participants[1]);
  const person2Recent = analyzeEngagement(recent, participants[1]);

  const person1EmojiChange = person1Early.avgEmojis > 0
    ? ((person1Recent.avgEmojis - person1Early.avgEmojis) / person1Early.avgEmojis) * 100
    : 0;
  const person2EmojiChange = person2Early.avgEmojis > 0
    ? ((person2Recent.avgEmojis - person2Early.avgEmojis) / person2Early.avgEmojis) * 100
    : 0;

  const person1LengthChange = person1Early.avgLength > 0
    ? ((person1Recent.avgLength - person1Early.avgLength) / person1Early.avgLength) * 100
    : 0;
  const person2LengthChange = person2Early.avgLength > 0
    ? ((person2Recent.avgLength - person2Early.avgLength) / person2Early.avgLength) * 100
    : 0;

  const avgEmojiChange = (person1EmojiChange + person2EmojiChange) / 2;
  const avgLengthChange = (person1LengthChange + person2LengthChange) / 2;

  // Less critical for professional relationships
  const threshold = relationshipType === 'professional' ? { warning: -35, critical: -60 } : { warning: -25, critical: -50 };

  let severity: Severity = 'healthy';
  let detected = false;

  if (avgEmojiChange < threshold.critical || avgLengthChange < threshold.critical) {
    severity = 'critical';
    detected = true;
  } else if (avgEmojiChange < threshold.warning || avgLengthChange < threshold.warning) {
    severity = 'warning';
    detected = true;
  }

  return {
    type: 'emotional_disengagement',
    detected,
    severity,
    title: 'Engagement Level',
    description: detected
      ? `Message engagement has decreased (emojis: ${avgEmojiChange.toFixed(0)}%, length: ${avgLengthChange.toFixed(0)}%). This might reflect changing communication styles.`
      : 'Engagement levels are healthy.',
    icon: '💬',
    metrics: {
      emojiChange: avgEmojiChange.toFixed(1),
      messageLengthChange: avgLengthChange.toFixed(1),
      person1Change: {
        emoji: person1EmojiChange.toFixed(1),
        length: person1LengthChange.toFixed(1)
      },
      person2Change: {
        emoji: person2EmojiChange.toFixed(1),
        length: person2LengthChange.toFixed(1)
      }
    },
    affectedPerson: null,
    trend: (avgEmojiChange < -25 || avgLengthChange < -25) ? 'worsening' : 'stable',
    recommendations: detected ? [
      'Try sharing something exciting or meaningful',
      'Check in about how they\'re feeling',
      'Communication styles can evolve - that\'s okay',
      'Quality of connection matters more than message length'
    ] : []
  };
};

// 5. GHOSTING PATTERNS
const detectGhostingPatterns = (messages: Message[], participants: string[]): HealthFlag => {
  const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentMessages = sortedMessages.filter(m => m.timestamp >= last30Days);

  let person1Ghosted = 0;
  let person2Ghosted = 0;
  let longestGhost = 0;

  for (let i = 0; i < recentMessages.length - 1; i++) {
    const current = recentMessages[i];
    const next = recentMessages[i + 1];

    // Check if same person sent 2+ messages with 24+ hour gap before reply
    if (current.sender === next.sender) {
      let consecutiveCount = 1;
      let j = i + 1;

      while (j < recentMessages.length && recentMessages[j].sender === current.sender) {
        consecutiveCount++;
        j++;
      }

      if (j < recentMessages.length && consecutiveCount >= 2) {
        const timeDiff = (recentMessages[j].timestamp.getTime() - current.timestamp.getTime()) / (1000 * 60 * 60);

        if (timeDiff >= 24) {
          if (current.sender === participants[0]) {
            person1Ghosted++;
          } else {
            person2Ghosted++;
          }

          longestGhost = Math.max(longestGhost, timeDiff);
        }
      }
    }
  }

  const totalIncidents = person1Ghosted + person2Ghosted;

  let severity: Severity = 'healthy';
  let detected = false;

  if (totalIncidents > 4) {
    severity = 'critical';
    detected = true;
  } else if (totalIncidents >= 2) {
    severity = 'warning';
    detected = true;
  }

  const affectedPerson = person1Ghosted > person2Ghosted
    ? participants[0]
    : person2Ghosted > person1Ghosted
    ? participants[1]
    : null;

  return {
    type: 'ghosting_patterns',
    detected,
    severity,
    title: 'Response Patterns',
    description: detected
      ? `${totalIncidents} instances of delayed responses (24+ hours) in the last month. Everyone needs space sometimes.`
      : 'Response patterns look healthy.',
    icon: '👻',
    metrics: {
      person1GhostedCount: person1Ghosted,
      person2GhostedCount: person2Ghosted,
      totalIncidents,
      longestGhostDuration: longestGhost.toFixed(1)
    },
    affectedPerson,
    trend: 'stable',
    recommendations: detected ? [
      'Everyone needs space sometimes - respect boundaries',
      'Try giving time between messages',
      'Have a conversation about communication preferences',
      'Consider if timing or life events might be factors'
    ] : []
  };
};

// POSITIVE PATTERNS
const detectPositivePatterns = (
  messages: Message[],
  participants: string[],
  flags: HealthFlag[]
): PositivePattern[] => {
  const patterns: PositivePattern[] = [];

  // Check for improving trends
  const frequencyFlag = flags.find(f => f.type === 'declining_frequency');
  if (frequencyFlag && frequencyFlag.trend === 'improving') {
    patterns.push({
      type: 'increasing_frequency',
      title: 'Growing Connection',
      description: 'You\'re chatting more frequently - the conversation is thriving!',
      icon: '📈'
    });
  }

  const responseFlag = flags.find(f => f.type === 'slowing_responses');
  if (responseFlag && responseFlag.trend === 'improving') {
    patterns.push({
      type: 'faster_responses',
      title: 'Quick Responses',
      description: 'Response times are getting faster - great engagement!',
      icon: '⚡'
    });
  }

  // Check balance
  const balanceFlag = flags.find(f => f.type === 'one_sided_communication');
  if (balanceFlag && !balanceFlag.detected) {
    patterns.push({
      type: 'balanced_communication',
      title: 'Balanced Exchange',
      description: 'Both participants contribute equally to the conversation.',
      icon: '⚖️'
    });
  }

  // Check consistency
  const ghostingFlag = flags.find(f => f.type === 'ghosting_patterns');
  if (ghostingFlag && !ghostingFlag.detected) {
    patterns.push({
      type: 'consistent_engagement',
      title: 'Consistent Communication',
      description: 'Regular, reliable responses show strong communication habits.',
      icon: '🎯'
    });
  }

  return patterns;
};

// MAIN ANALYSIS FUNCTION
export const analyzeRelationshipHealth = (
  messages: Message[],
  participants: string[],
  relationshipType: RelationshipType
): HealthAnalysis => {
  // Detect all flags
  const flags: HealthFlag[] = [
    detectOneSidedCommunication(messages, participants, relationshipType),
    detectDecliningFrequency(messages),
    detectSlowingResponses(messages, participants, relationshipType),
    detectEmotionalDisengagement(messages, participants, relationshipType),
    detectGhostingPatterns(messages, participants)
  ];

  // Detect positive patterns
  const positivePatterns = detectPositivePatterns(messages, participants, flags);

  // Calculate health score
  let healthScore = 100;

  flags.forEach(flag => {
    if (flag.detected) {
      if (flag.severity === 'critical') healthScore -= 20;
      else if (flag.severity === 'warning') healthScore -= 10;
    }
  });

  // Add points for positive patterns (max +15)
  healthScore += Math.min(positivePatterns.length * 5, 15);
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Determine overall health
  let overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  if (healthScore >= 90) overallHealth = 'excellent';
  else if (healthScore >= 75) overallHealth = 'good';
  else if (healthScore >= 60) overallHealth = 'fair';
  else if (healthScore >= 40) overallHealth = 'poor';
  else overallHealth = 'critical';

  // Calculate trends
  const frequencyFlag = flags.find(f => f.type === 'declining_frequency');
  const responseFlag = flags.find(f => f.type === 'slowing_responses');
  const engagementFlag = flags.find(f => f.type === 'emotional_disengagement');
  const balanceFlag = flags.find(f => f.type === 'one_sided_communication');

  const trends = {
    messageFrequency: {
      direction: (frequencyFlag?.trend === 'improving' ? 'increasing' : frequencyFlag?.trend === 'worsening' ? 'declining' : 'stable') as Direction,
      percentage: parseFloat(frequencyFlag?.metrics?.changePercentage || '0')
    },
    responseTime: {
      direction: (responseFlag?.trend === 'improving' ? 'faster' : responseFlag?.trend === 'worsening' ? 'slower' : 'stable') as Direction,
      percentage: Math.max(
        parseFloat(responseFlag?.metrics?.person1?.changePercentage || '0'),
        parseFloat(responseFlag?.metrics?.person2?.changePercentage || '0')
      )
    },
    engagement: {
      direction: (engagementFlag?.trend === 'worsening' ? 'declining' : 'stable') as Direction,
      percentage: parseFloat(engagementFlag?.metrics?.emojiChange || '0')
    },
    balance: {
      direction: 'stable' as Direction,
      currentRatio: parseFloat(balanceFlag?.metrics?.person1Percentage || '50')
    }
  };

  // Summary
  const detectedFlags = flags.filter(f => f.detected);
  const summary = {
    totalFlags: detectedFlags.length,
    criticalFlags: detectedFlags.filter(f => f.severity === 'critical').length,
    warningFlags: detectedFlags.filter(f => f.severity === 'warning').length,
    positivePatterns: positivePatterns.length
  };

  return {
    overallHealth,
    healthScore,
    flags,
    positivePatterns,
    trends,
    summary
  };
};
