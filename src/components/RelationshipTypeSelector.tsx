import { Card } from '@/components/ui/card';
import { Heart, Users, Home, Briefcase, MessageCircle } from 'lucide-react';

export type RelationshipType = 'romantic' | 'friend' | 'family' | 'professional' | 'other';

interface RelationshipOption {
  type: RelationshipType;
  icon: React.ElementType;
  title: string;
  description: string;
  focus: string;
  gradient: string;
  emoji: string;
}

const relationshipOptions: RelationshipOption[] = [
  {
    type: 'romantic',
    icon: Heart,
    title: 'Romantic Partner',
    description: 'Dating, relationship, or spouse',
    focus: 'Response time, emotional expression',
    gradient: 'from-pink-500 to-rose-500',
    emoji: '💕'
  },
  {
    type: 'friend',
    icon: Users,
    title: 'Friend',
    description: 'Best friend, close friend, or buddy',
    focus: 'Engagement, shared interests',
    gradient: 'from-blue-500 to-cyan-500',
    emoji: '👥'
  },
  {
    type: 'family',
    icon: Home,
    title: 'Family Member',
    description: 'Parent, sibling, or relative',
    focus: 'Consistency, staying connected',
    gradient: 'from-teal-500 to-green-500',
    emoji: '👨‍👩‍👧'
  },
  {
    type: 'professional',
    icon: Briefcase,
    title: 'Professional',
    description: 'Colleague, client, or business contact',
    focus: 'Response time, professionalism',
    gradient: 'from-violet-500 to-purple-500',
    emoji: '💼'
  },
  {
    type: 'other',
    icon: MessageCircle,
    title: 'Other',
    description: 'General chat analysis',
    focus: 'Balanced analysis',
    gradient: 'from-pink-500 via-purple-500 to-yellow-500',
    emoji: '💬'
  }
];

interface RelationshipTypeSelectorProps {
  onSelect: (type: RelationshipType) => void;
}

export const RelationshipTypeSelector = ({ onSelect }: RelationshipTypeSelectorProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-200 dark:border-purple-800">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Step 2 of 2</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold prism-text">
            What type of conversation is this?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We'll tailor the analysis to give you the most relevant insights
          </p>
        </div>

        {/* Relationship Type Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relationshipOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.type}
                onClick={() => onSelect(option.type)}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-purple-300 dark:hover:border-purple-700 p-6 glass-effect"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl">{option.emoji}</span>
                  </div>
                  
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Focus Area */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Focus:</span> {option.focus}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 All analysis happens in your browser. Your data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelationshipTypeSelector;
