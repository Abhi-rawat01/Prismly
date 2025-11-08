import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Target, Clock, Heart, MessageSquare, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onReset?: () => void;
}

export function MobileMenu({
  currentTab = 'overview',
  onTabChange,
  onReset
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark'; // Default to dark mode

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    if (onReset) onReset();
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Target },
    { id: 'reply-times', label: 'Responsiveness', icon: Clock },
    { id: 'emojis', label: 'Engagement', icon: Heart },
    { id: 'words', label: 'Conversation', icon: MessageSquare },
    { id: 'activity', label: 'Patterns', icon: Activity },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="fixed top-2 left-2 z-50 md:hidden h-12 w-12 p-0 hover:bg-purple-100/20 dark:hover:bg-purple-900/30 rounded-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white stroke-[2.5]" />
        ) : (
          <Menu className="h-6 w-6 text-white stroke-[2.5]" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMenu}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 h-screen w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6 space-y-4 pb-20">
              {/* Close button */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="h-10 w-10"
                >
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Navigation
                </h3>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive
                          ? 'text-white'
                          : 'text-purple-600 dark:text-purple-400'
                          }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* New Chat Button */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Actions
                </h3>
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">New Chat</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Theme Toggle */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Settings
                </h3>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Theme Mode
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full border-2 hover:scale-110 transition-all duration-300"
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    ) : (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
