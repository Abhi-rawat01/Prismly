import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Check } from 'lucide-react';
import { RelationshipType } from '@/components/RelationshipTypeSelector';

interface RelationshipTypeSwitcherProps {
  currentType: RelationshipType;
  onTypeChange: (newType: RelationshipType) => void;
}

const relationshipTypes: { value: RelationshipType; emoji: string; label: string; color: string }[] = [
  { value: 'romantic', emoji: '💕', label: 'Romantic', color: 'from-pink-500 to-rose-500' },
  { value: 'friend', emoji: '👥', label: 'Friend', color: 'from-blue-500 to-cyan-500' },
  { value: 'family', emoji: '👨‍👩‍👧', label: 'Family', color: 'from-teal-500 to-green-500' },
  { value: 'professional', emoji: '💼', label: 'Professional', color: 'from-violet-500 to-purple-500' },
  { value: 'other', emoji: '💬', label: 'Other', color: 'from-pink-500 via-purple-500 to-yellow-500' }
];

export const RelationshipTypeSwitcher = ({ currentType, onTypeChange }: RelationshipTypeSwitcherProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTypeInfo = relationshipTypes.find(t => t.value === currentType) || relationshipTypes[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleTypeChange = async (newType: RelationshipType) => {
    if (newType === currentType) {
      setIsExpanded(false);
      return;
    }

    setIsChanging(true);

    // Simulate recalculation delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 300));

    onTypeChange(newType);
    setIsChanging(false);
    setIsExpanded(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Type Display */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full glass-effect border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg"
      >
        <div className={`p-0.5 md:p-1.5 rounded-full bg-gradient-to-r ${currentTypeInfo.color}`}>
          <span className="text-sm md:text-lg">{currentTypeInfo.emoji}</span>
        </div>
        {/* Hide label on mobile, show on desktop */}
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTypeInfo.label}
        </span>
        <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isChanging ? 'animate-spin' : ''}`} />
      </button>

      {/* Expanded Options */}
      {isExpanded && (
        <Card className="absolute top-full mt-2 right-0 z-50 glass-effect border-2 border-purple-300 dark:border-purple-700 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 min-w-[240px]">
          <CardContent className="p-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 mb-2">
                Switch Relationship Type
              </p>
              {relationshipTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  disabled={isChanging}
                  className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-300 ${type.value === currentType
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.emoji}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  {type.value === currentType && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                💡 Changing type will recalculate insights
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
