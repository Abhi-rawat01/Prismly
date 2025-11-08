import { RelationshipType } from '@/components/RelationshipTypeSelector';

interface Verdict {
  emoji: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

type VerdictTier = 'excellent' | 'strong' | 'good' | 'fair' | 'needs-work';

const VERDICTS: Record<RelationshipType, Record<VerdictTier, Verdict>> = {
  romantic: {
    'excellent': {
      emoji: '💕',
      title: 'Deeply Connected',
      description: 'Your communication patterns show exceptional mutual interest and emotional investment. Quick responses, balanced engagement, and consistent interaction all point to a strong romantic connection.',
      color: 'from-pink-500 to-rose-500',
      gradient: 'from-pink-100 via-rose-100 to-red-100'
    },
    'strong': {
      emoji: '❤️',
      title: 'Strong Romantic Potential',
      description: 'The data shows genuine mutual interest with good response times and emotional expression. There\'s definitely something special here worth nurturing.',
      color: 'from-red-500 to-pink-500',
      gradient: 'from-red-100 via-pink-100 to-rose-100'
    },
    'good': {
      emoji: '💗',
      title: 'Positive Connection',
      description: 'You\'re both showing interest with decent engagement patterns. The foundation is there, though there\'s room to deepen the connection.',
      color: 'from-pink-500 to-purple-500',
      gradient: 'from-pink-100 via-purple-100 to-violet-100'
    },
    'fair': {
      emoji: '💭',
      title: 'Mixed Signals',
      description: 'The communication patterns show some interest but also inconsistency. One person might be more invested than the other.',
      color: 'from-purple-500 to-blue-500',
      gradient: 'from-purple-100 via-blue-100 to-cyan-100'
    },
    'needs-work': {
      emoji: '🤔',
      title: 'Low Romantic Indicators',
      description: 'The data suggests limited mutual romantic interest. Slow responses and imbalanced engagement might indicate this is more platonic.',
      color: 'from-gray-500 to-blue-500',
      gradient: 'from-gray-100 via-blue-100 to-slate-100'
    }
  },
  friend: {
    'excellent': {
      emoji: '🌟',
      title: 'Best Friends Energy',
      description: 'This friendship is thriving! High engagement, great balance, and consistent communication show a strong, healthy friendship.',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-100 via-cyan-100 to-teal-100'
    },
    'strong': {
      emoji: '✨',
      title: 'Solid Friendship',
      description: 'You have a strong friendship with good mutual engagement and regular communication. Keep nurturing this connection!',
      color: 'from-cyan-500 to-teal-500',
      gradient: 'from-cyan-100 via-teal-100 to-blue-100'
    },
    'good': {
      emoji: '👥',
      title: 'Good Friends',
      description: 'A healthy friendship with decent engagement. You enjoy each other\'s company and stay in touch regularly.',
      color: 'from-teal-500 to-blue-500',
      gradient: 'from-teal-100 via-blue-100 to-cyan-100'
    },
    'fair': {
      emoji: '🤝',
      title: 'Casual Friends',
      description: 'You\'re friendly but the connection could be deeper. Consider reaching out more often to strengthen the bond.',
      color: 'from-blue-500 to-indigo-500',
      gradient: 'from-blue-100 via-indigo-100 to-purple-100'
    },
    'needs-work': {
      emoji: '💬',
      title: 'Distant Connection',
      description: 'The friendship shows signs of drifting. Low engagement and inconsistent communication suggest you might be growing apart.',
      color: 'from-gray-500 to-blue-500',
      gradient: 'from-gray-100 via-blue-100 to-slate-100'
    }
  },
  family: {
    'excellent': {
      emoji: '🏠',
      title: 'Exceptionally Close',
      description: 'Your family bond is remarkably strong! Consistent communication and genuine engagement show a healthy, loving relationship.',
      color: 'from-teal-500 to-green-500',
      gradient: 'from-teal-100 via-green-100 to-emerald-100'
    },
    'strong': {
      emoji: '💚',
      title: 'Strong Family Bond',
      description: 'You maintain a solid connection with regular check-ins and meaningful conversations. This is a healthy family relationship.',
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-100 via-emerald-100 to-teal-100'
    },
    'good': {
      emoji: '👨‍👩‍👧',
      title: 'Staying Connected',
      description: 'You keep in touch regularly and show care for each other. The family bond is present and maintained.',
      color: 'from-emerald-500 to-teal-500',
      gradient: 'from-emerald-100 via-teal-100 to-green-100'
    },
    'fair': {
      emoji: '📱',
      title: 'Occasional Contact',
      description: 'You stay in touch but not as consistently as you could. Consider reaching out more often to strengthen family ties.',
      color: 'from-teal-500 to-blue-500',
      gradient: 'from-teal-100 via-blue-100 to-cyan-100'
    },
    'needs-work': {
      emoji: '🔗',
      title: 'Needs More Connection',
      description: 'Communication is infrequent and engagement is low. Family relationships need regular nurturing to stay strong.',
      color: 'from-gray-500 to-teal-500',
      gradient: 'from-gray-100 via-teal-100 to-slate-100'
    }
  },
  professional: {
    'excellent': {
      emoji: '⭐',
      title: 'Excellent Collaboration',
      description: 'Outstanding professional relationship! Quick responses, balanced communication, and consistent engagement show exceptional working dynamics.',
      color: 'from-violet-500 to-purple-500',
      gradient: 'from-violet-100 via-purple-100 to-fuchsia-100'
    },
    'strong': {
      emoji: '🎯',
      title: 'Strong Professional Rapport',
      description: 'You have a solid working relationship with good responsiveness and professional communication patterns.',
      color: 'from-purple-500 to-indigo-500',
      gradient: 'from-purple-100 via-indigo-100 to-violet-100'
    },
    'good': {
      emoji: '💼',
      title: 'Good Working Relationship',
      description: 'Professional and reliable communication. You work well together and maintain appropriate boundaries.',
      color: 'from-indigo-500 to-blue-500',
      gradient: 'from-indigo-100 via-blue-100 to-purple-100'
    },
    'fair': {
      emoji: '📊',
      title: 'Functional Collaboration',
      description: 'The working relationship is adequate but could be more efficient. Consider improving response times or communication frequency.',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-100 via-cyan-100 to-indigo-100'
    },
    'needs-work': {
      emoji: '⚠️',
      title: 'Communication Gaps',
      description: 'Professional communication shows significant delays or imbalance. This could impact productivity and collaboration.',
      color: 'from-gray-500 to-purple-500',
      gradient: 'from-gray-100 via-purple-100 to-slate-100'
    }
  },
  other: {
    'excellent': {
      emoji: '🌈',
      title: 'Excellent Connection',
      description: 'This conversation shows outstanding engagement across all metrics. Quick responses, balanced participation, and consistent communication.',
      color: 'from-pink-500 via-purple-500 to-blue-500',
      gradient: 'from-pink-100 via-purple-100 to-blue-100'
    },
    'strong': {
      emoji: '✨',
      title: 'Strong Connection',
      description: 'Great communication patterns with good balance and engagement. This is a healthy, active conversation.',
      color: 'from-purple-500 via-blue-500 to-cyan-500',
      gradient: 'from-purple-100 via-blue-100 to-cyan-100'
    },
    'good': {
      emoji: '💬',
      title: 'Good Communication',
      description: 'Solid conversation patterns with decent engagement and balance. The connection is positive overall.',
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      gradient: 'from-blue-100 via-cyan-100 to-teal-100'
    },
    'fair': {
      emoji: '📱',
      title: 'Moderate Engagement',
      description: 'The conversation shows average engagement. There\'s room for improvement in responsiveness or consistency.',
      color: 'from-cyan-500 via-teal-500 to-green-500',
      gradient: 'from-cyan-100 via-teal-100 to-green-100'
    },
    'needs-work': {
      emoji: '🔄',
      title: 'Low Engagement',
      description: 'Communication patterns show limited engagement or significant imbalance. Consider whether this conversation is meeting your needs.',
      color: 'from-gray-500 to-blue-500',
      gradient: 'from-gray-100 via-blue-100 to-slate-100'
    }
  }
};

export const getVerdict = (score: number, relationshipType: RelationshipType): Verdict => {
  let tier: VerdictTier;
  
  if (score >= 90) tier = 'excellent';
  else if (score >= 75) tier = 'strong';
  else if (score >= 60) tier = 'good';
  else if (score >= 40) tier = 'fair';
  else tier = 'needs-work';
  
  return VERDICTS[relationshipType][tier];
};

export const getScoreTier = (score: number): VerdictTier => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'needs-work';
};
