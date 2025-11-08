import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator, Clock, MapPin, Sparkles } from 'lucide-react';
import { ConversationMathematics as MathData } from '@/utils/conversationMath';

interface ConversationMathematicsProps {
  data: MathData;
}

export const ConversationMathematics = ({ data }: ConversationMathematicsProps) => {
  const funFacts = [
    {
      category: 'Time Statistics',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      facts: [
        {
          label: 'Total hours spent messaging',
          value: `${data.timeStats.totalHours.toLocaleString()} hours`,
          subtext: `That's ${data.timeStats.totalDays} days of your life!`
        },
        {
          label: 'If messages were pages',
          value: `${data.timeStats.bookPages.toLocaleString()}-page book`,
          subtext: `Reading time: ${data.timeStats.readingHours} hours of content`
        }
      ]
    },
    {
      category: 'Distance & Scale',
      icon: MapPin,
      color: 'from-purple-500 to-pink-500',
      facts: [
        {
          label: 'Total characters typed',
          value: data.distanceStats.totalCharacters.toLocaleString(),
          subtext: `That's the length of ${data.distanceStats.novelEquivalent} novels`
        },
        {
          label: 'Message frequency',
          value: `Once every ${data.distanceStats.messageFrequency} hours`,
          subtext: 'Average time between messages'
        }
      ]
    }
  ];

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-purple-600" />
          <span className="text-2xl font-bold prism-text">Conversation Mathematics</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Mind-blowing calculations about your conversation
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {funFacts.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {section.category}
                  </h3>
                </div>

                {/* Facts Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {section.facts.map((fact, factIdx) => (
                    <div
                      key={factIdx}
                      className="p-4 rounded-xl glass-effect border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {fact.label}
                        </p>
                        <p className="text-xl font-bold prism-text">
                          {fact.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          {fact.subtext}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Fun Footer */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              <span className="font-bold">🎯 Fun Fact:</span> These calculations are based on your actual conversation data and show the incredible scale of your communication!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
