import { useState, Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, MessageCircle, Lock, Sparkles, Target, TrendingUp, Palette } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ChatData } from '@/types/chat';
import { handleChatParsing } from '@/pages/api/parse-chat';

// Lazy load heavy components
const FileUpload = lazy(() => import('@/components/FileUpload'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const RelationshipTypeSelector = lazy(() => import('@/components/RelationshipTypeSelector'));
const ServerWakeUp = lazy(() => import('@/components/ServerWakeUp'));

const Index = () => {
  const { 
    uploadedFile, 
    relationshipType, 
    chatData, 
    isAnalyzing, 
    error, 
    showServerWakeUp, 
    serverReady,
    setUploadedFile,
    setRelationshipType,
    setChatData,
    setIsAnalyzing,
    setError,
    setShowServerWakeUp,
    setServerReady,
    resetState
  } = useAppStore();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setError(null);
    setIsAnalyzing(true);
    
    // Backup file to Session Storage
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        const backupData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          content: fileContent,
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('chat_backup', JSON.stringify(backupData));
        console.log('✅ File backed up to Session Storage:', file.name);
      };
      reader.readAsText(file);
    } catch (backupError) {
      console.warn('⚠️ Could not backup file to Session Storage:', backupError);
    }
    
    // Automatically start analysis with "friend" as default
    const defaultType = 'friend';
    setRelationshipType(defaultType);
    
    try {
      const data = await handleChatParsing(file);
      setChatData(data);
    } catch (err) {
      console.error('Error parsing chat:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred during analysis.'
      );
      setUploadedFile(null);
      setRelationshipType(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    resetState();
    // Clear backup from Session Storage when resetting
    sessionStorage.removeItem('chat_backup');
    console.log('🗑️ Backup cleared from Session Storage');
  };

  const handleServerReady = () => {
    setServerReady(true);
    setShowServerWakeUp(false);
  };

  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <Card className="max-w-md w-full p-8 glass-effect border-2 shadow-2xl">
          <div className="space-y-6">
            {/* Animated Prism Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-50 prism-gradient rounded-full animate-pulse"></div>
                <svg className="relative h-24 w-24 animate-prism" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(270, 70%, 60%)" />
                      <stop offset="25%" stopColor="hsl(210, 80%, 55%)" />
                      <stop offset="50%" stopColor="hsl(190, 80%, 50%)" />
                      <stop offset="75%" stopColor="hsl(330, 75%, 65%)" />
                      <stop offset="100%" stopColor="hsl(270, 70%, 60%)" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,10 90,80 10,80" fill="url(#loadingGradient)" opacity="0.8" className="animate-pulse" />
                  <polygon points="50,10 90,80 10,80" fill="none" stroke="url(#loadingGradient)" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold prism-text animate-gradient">
                Analyzing Your Chat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Refracting your conversation into colorful insights...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="h-2 prism-gradient rounded-full animate-progress"></div>
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span>Parsing messages...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-100"></div>
                <span>Calculating metrics...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse delay-200"></div>
                <span>Generating insights...</span>
              </div>
            </div>

            {/* Tip */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                💡 Tip: You can switch relationship type later to see different perspectives
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (chatData && relationshipType) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton />}>
          <Dashboard chatData={chatData} relationshipType={relationshipType} onReset={handleReset} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <>
      {showServerWakeUp && !serverReady && (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSkeleton />}>
            <ServerWakeUp onServerReady={handleServerReady} />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Floating Icons */}
      <Sparkles className="absolute top-[10%] left-[5%] h-20 w-20 text-violet-400/20 -rotate-12 animate-float" />
      <MessageCircle className="absolute top-[20%] right-[10%] h-16 w-16 text-purple-400/20 rotate-12 animate-float-delayed" />
      <Target className="absolute bottom-[15%] left-[15%] h-24 w-24 text-pink-400/20 animate-float" />
      <TrendingUp className="absolute bottom-[25%] right-[20%] h-14 w-14 text-cyan-400/20 animate-float-delayed" />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* Prism Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-30 prism-gradient rounded-full"></div>
                <svg className="relative h-20 w-20 animate-prism" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(270, 70%, 60%)" />
                      <stop offset="25%" stopColor="hsl(210, 80%, 55%)" />
                      <stop offset="50%" stopColor="hsl(190, 80%, 50%)" />
                      <stop offset="75%" stopColor="hsl(330, 75%, 65%)" />
                      <stop offset="100%" stopColor="hsl(270, 70%, 60%)" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,10 90,80 10,80" fill="url(#prismGradient)" opacity="0.8" />
                  <polygon points="50,10 90,80 10,80" fill="none" stroke="url(#prismGradient)" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
              <span className="prism-text animate-gradient">
                Prismly
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Conversations refracted into colorful insights, like light through a prism
            </p>

            {/* Use Case Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <span className="px-4 py-2 rounded-full glass-effect text-sm font-medium border border-pink-200 dark:border-pink-800">
                💕 Relationships
              </span>
              <span className="px-4 py-2 rounded-full glass-effect text-sm font-medium border border-blue-200 dark:border-blue-800">
                👥 Friendships
              </span>
              <span className="px-4 py-2 rounded-full glass-effect text-sm font-medium border border-teal-200 dark:border-teal-800">
                👨‍👩‍👧 Family
              </span>
              <span className="px-4 py-2 rounded-full glass-effect text-sm font-medium border border-purple-200 dark:border-purple-800">
                💼 Professional
              </span>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="flex justify-center">
            <Card className="max-w-lg w-full p-6 md:p-8 glass-effect shadow-2xl border-2 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50 transition-all duration-300">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSkeleton />}>
                  <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
                </Suspense>
              </ErrorBoundary>
              {error && (
                <div className="mt-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                  <p className="font-bold text-lg">Analysis Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Privacy Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-green-200 dark:border-green-800">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                🔒 100% Private - All analysis happens in your browser
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-violet-100 dark:border-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Connection Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Objective measure tailored to your relationship type</p>
            </div>

            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Multi-Dimensional Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Response times, engagement, balance, consistency</p>
            </div>

            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">100% Private</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">All analysis happens in your browser</p>
            </div>

            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-yellow-100 dark:border-yellow-900/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Actionable Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Understand patterns and improve communication</p>
            </div>

            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Beautiful Visualizations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Interactive charts and timelines</p>
            </div>

            <div className="group space-y-4 p-6 rounded-2xl glass-effect border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Any Relationship</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Analyze any type of conversation with custom metrics</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Made with ❤️ by{' '}
          <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300">
            Abhi_rwt
          </a>
        </p>
      </footer>
    </div>
    </>
  );
};

export default Index;
