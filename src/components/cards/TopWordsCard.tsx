import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Crown } from 'lucide-react';
import { WordData } from '@/types/chat';

interface TopWordsCardProps {
  data: WordData[];
  participants: string[];
}

export const TopWordsCard = ({ data, participants }: TopWordsCardProps) => {
  // Get top 5 words for each participant
  const getTopWordsByPerson = (person: string) => {
    return data
      .filter(w => w.sender === person)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const person1Words = getTopWordsByPerson(participants[0]);
  const person2Words = getTopWordsByPerson(participants[1]);

  if (person1Words.length === 0 && person2Words.length === 0) {
    return null;
  }

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
          Top 5 Most Used Words
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Favorite expressions by each person
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Person 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {participants[0]?.split(' ')[0]}
              </h3>
            </div>

            {person1Words.length > 0 ? (
              <div className="space-y-2">
                {person1Words.map((word, idx) => (
                  <div
                    key={`${word.word}-${idx}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {word.word}
                      </span>
                    </div>
                    <span className="text-sm font-bold prism-text">
                      {word.count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No data available
              </p>
            )}
          </div>

          {/* Person 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {participants[1]?.split(' ')[0]}
              </h3>
            </div>

            {person2Words.length > 0 ? (
              <div className="space-y-2">
                {person2Words.map((word, idx) => (
                  <div
                    key={`${word.word}-${idx}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {word.word}
                      </span>
                    </div>
                    <span className="text-sm font-bold prism-text">
                      {word.count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 These frequently used words reveal each person's communication style and favorite topics
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
