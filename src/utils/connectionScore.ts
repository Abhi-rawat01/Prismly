import { RelationshipType } from '@/components/RelationshipTypeSelector';

interface ScoreWeights {
  replySpeed: number;
  engagement: number;
  balance: number;
  consistency: number;
}

const RELATIONSHIP_WEIGHTS: Record<RelationshipType, ScoreWeights> = {
  romantic: {
    replySpeed: 0.30,  // 30% - very important
    engagement: 0.35,  // 35% - very important
    balance: 0.20,     // 20% - important
    consistency: 0.15  // 15% - somewhat important
  },
  friend: {
    replySpeed: 0.15,  // 15% - less important
    engagement: 0.35,  // 35% - very important
    balance: 0.25,     // 25% - important
    consistency: 0.25  // 25% - important
  },
  family: {
    replySpeed: 0.10,  // 10% - least important
    engagement: 0.25,  // 25% - important
    balance: 0.20,     // 20% - somewhat important
    consistency: 0.45  // 45% - most important
  },
  professional: {
    replySpeed: 0.45,  // 45% - most important
    engagement: 0.15,  // 15% - less important
    balance: 0.30,     // 30% - important
    consistency: 0.10  // 10% - least important
  },
  other: {
    replySpeed: 0.25,  // 25% - balanced
    engagement: 0.25,  // 25% - balanced
    balance: 0.25,     // 25% - balanced
    consistency: 0.25  // 25% - balanced
  }
};

interface ConnectionScoreParams {
  avgReplyTime: number;
  totalEmojis: number;
  totalMessages: number;
  messageRatio: number;
  consistencyRatio: number;
  relationshipType: RelationshipType;
}

export const calculateConnectionScore = (params: ConnectionScoreParams): number => {
  const {
    avgReplyTime,
    totalEmojis,
    totalMessages,
    messageRatio,
    consistencyRatio,
    relationshipType
  } = params;

  const weights = RELATIONSHIP_WEIGHTS[relationshipType];

  // Calculate individual component scores (0-100)
  
  // 1. Reply Speed Score
  let replySpeedScore = 50;
  if (avgReplyTime < 2) replySpeedScore = 100;
  else if (avgReplyTime < 5) replySpeedScore = 85;
  else if (avgReplyTime < 10) replySpeedScore = 70;
  else if (avgReplyTime < 30) replySpeedScore = 55;
  else if (avgReplyTime < 60) replySpeedScore = 40;
  else if (avgReplyTime < 120) replySpeedScore = 25;
  else replySpeedScore = 10;

  // 2. Engagement Score (based on emoji usage)
  const emojiRatio = totalEmojis / totalMessages;
  let engagementScore = 50;
  if (emojiRatio > 0.5) engagementScore = 100;
  else if (emojiRatio > 0.3) engagementScore = 85;
  else if (emojiRatio > 0.2) engagementScore = 70;
  else if (emojiRatio > 0.1) engagementScore = 55;
  else if (emojiRatio > 0.05) engagementScore = 40;
  else engagementScore = 25;

  // 3. Balance Score
  let balanceScore = 50;
  if (messageRatio > 0.45) balanceScore = 100;
  else if (messageRatio > 0.40) balanceScore = 85;
  else if (messageRatio > 0.35) balanceScore = 70;
  else if (messageRatio > 0.30) balanceScore = 55;
  else if (messageRatio > 0.25) balanceScore = 40;
  else if (messageRatio > 0.20) balanceScore = 25;
  else balanceScore = 10;

  // 4. Consistency Score
  let consistencyScore = 50;
  if (consistencyRatio > 0.8) consistencyScore = 100;
  else if (consistencyRatio > 0.6) consistencyScore = 85;
  else if (consistencyRatio > 0.5) consistencyScore = 70;
  else if (consistencyRatio > 0.4) consistencyScore = 55;
  else if (consistencyRatio > 0.3) consistencyScore = 40;
  else if (consistencyRatio > 0.2) consistencyScore = 25;
  else consistencyScore = 10;

  // Calculate weighted final score
  const finalScore = 
    (replySpeedScore * weights.replySpeed) +
    (engagementScore * weights.engagement) +
    (balanceScore * weights.balance) +
    (consistencyScore * weights.consistency);

  return Math.round(Math.max(0, Math.min(100, finalScore)));
};

export const getScoreBreakdown = (params: ConnectionScoreParams) => {
  const {
    avgReplyTime,
    totalEmojis,
    totalMessages,
    messageRatio,
    consistencyRatio,
    relationshipType
  } = params;

  const weights = RELATIONSHIP_WEIGHTS[relationshipType];

  // Calculate individual scores
  let replySpeedScore = 50;
  if (avgReplyTime < 2) replySpeedScore = 100;
  else if (avgReplyTime < 5) replySpeedScore = 85;
  else if (avgReplyTime < 10) replySpeedScore = 70;
  else if (avgReplyTime < 30) replySpeedScore = 55;
  else if (avgReplyTime < 60) replySpeedScore = 40;
  else if (avgReplyTime < 120) replySpeedScore = 25;
  else replySpeedScore = 10;

  const emojiRatio = totalEmojis / totalMessages;
  let engagementScore = 50;
  if (emojiRatio > 0.5) engagementScore = 100;
  else if (emojiRatio > 0.3) engagementScore = 85;
  else if (emojiRatio > 0.2) engagementScore = 70;
  else if (emojiRatio > 0.1) engagementScore = 55;
  else if (emojiRatio > 0.05) engagementScore = 40;
  else engagementScore = 25;

  let balanceScore = 50;
  if (messageRatio > 0.45) balanceScore = 100;
  else if (messageRatio > 0.40) balanceScore = 85;
  else if (messageRatio > 0.35) balanceScore = 70;
  else if (messageRatio > 0.30) balanceScore = 55;
  else if (messageRatio > 0.25) balanceScore = 40;
  else if (messageRatio > 0.20) balanceScore = 25;
  else balanceScore = 10;

  let consistencyScore = 50;
  if (consistencyRatio > 0.8) consistencyScore = 100;
  else if (consistencyRatio > 0.6) consistencyScore = 85;
  else if (consistencyRatio > 0.5) consistencyScore = 70;
  else if (consistencyRatio > 0.4) consistencyScore = 55;
  else if (consistencyRatio > 0.3) consistencyScore = 40;
  else if (consistencyRatio > 0.2) consistencyScore = 25;
  else consistencyScore = 10;

  return {
    replySpeed: {
      score: replySpeedScore,
      weight: weights.replySpeed,
      contribution: replySpeedScore * weights.replySpeed
    },
    engagement: {
      score: engagementScore,
      weight: weights.engagement,
      contribution: engagementScore * weights.engagement
    },
    balance: {
      score: balanceScore,
      weight: weights.balance,
      contribution: balanceScore * weights.balance
    },
    consistency: {
      score: consistencyScore,
      weight: weights.consistency,
      contribution: consistencyScore * weights.consistency
    }
  };
};
