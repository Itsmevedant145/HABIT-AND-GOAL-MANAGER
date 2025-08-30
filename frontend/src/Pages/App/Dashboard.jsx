import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Maximize2, Minimize2, BarChart3, TrendingUp, Zap, Target } from 'lucide-react';
import { useAuth } from '../../Components/Auth/AuthContext';
import ProgressChart from '../../Components/Dashboard/ProgressChart';
import Statistics1 from '../../Components/Dashboard/Statistics1';
import Statistics2 from '../../Components/Dashboard/Statistics2';
import StreakCounter from '../../Components/Dashboard/StreakCounter';
import LoadingWithBar from '../../Components/UI/LoadingWithBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [showAll, setShowAll] = useState(false);

  const components = [
    { 
      Component: ProgressChart, 
      title: "Progress Analytics", 
      id: "progress",
      icon: BarChart3,
      gradient: "from-blue-500 to-purple-600",
      description: "Track your overall performance"
    },
    { 
      Component: Statistics1, 
      title: "Performance Insights", 
      id: "stats1",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      description: "Deep dive into your metrics"
    },
    { 
      Component: Statistics2, 
      title: "Activity Overview", 
      id: "stats2",
      icon: Zap,
      gradient: "from-amber-500 to-orange-600",
      description: "Your recent activity summary"
    },
    { 
      Component: StreakCounter, 
      title: "Streak Tracker", 
      id: "streak",
      icon: Target,
      gradient: "from-red-500 to-pink-600",
      description: "Maintain your momentum"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleAllCards = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    
    const newExpandedState = {};
    components.forEach(({ id }) => {
      newExpandedState[id] = newShowAll;
    });
    setExpandedCards(newExpandedState);
  };

  const CollapsibleCard = ({ Component, title, id, icon: Icon, gradient, description }) => {
    const isExpanded = expandedCards[id] || false;
    
    return (
      <div
        className="group relative rounded-2xl overflow-hidden transition-all duration-700 ease-out"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          boxShadow: isExpanded 
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(220, 38, 38, 0.1), 0 0 30px rgba(220, 38, 38, 0.05)`
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
             style={{ padding: '1px', borderRadius: '1rem' }}>
          <div className="w-full h-full rounded-2xl" style={{ backgroundColor: 'var(--bg-card)' }} />
        </div>

        {/* Header */}
        <div 
          className="relative z-10 px-8 py-6 cursor-pointer"
          onClick={() => toggleCard(id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                  {title}
                </h3>
                <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>
                  {description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isExpanded 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300'
              }`}>
                {isExpanded ? '✨ Full View' : '👁️ Preview'}
              </div>
              
              <div className={`p-2 rounded-full transition-all duration-300 ${
                isExpanded 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            isExpanded ? 'max-h-none opacity-100' : 'max-h-[350px] opacity-95'
          }`}
          style={{ overflow: 'hidden' }}
        >
          <div className="px-8 pb-6">
            <Component key={id} />
          </div>
          
          {!isExpanded && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-800 dark:via-gray-800/80" />
              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {!isExpanded && (
          <div className="relative z-10 px-8 pb-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCard(id);
              }}
              className={`w-full group relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${gradient}`}
              style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-3">
                <Maximize2 className="w-5 h-5" />
                <span>Explore {title}</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ paddingTop: '128px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
      className="p-6 md:p-10 min-h-screen"
    >
      {loading && (
        <LoadingWithBar message="Loading dashboard..." color="#7c3aed" height={4} />
      )}

      {!loading && (
        <>
          {/* Welcome Header */}
          <div className="relative w-full mb-12 p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-36 translate-x-36" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="text-sm text-blue-200 mb-2 font-medium tracking-wide">
                    Welcome back to your dashboard
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Hello, {user?.username || user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-blue-100 text-lg max-w-2xl">
                    Here's your personalized overview. Expand any section to dive deeper into your analytics.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-blue-200">Today</div>
                    <div className="text-2xl font-bold text-white">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Controls */}
          <div className="mb-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Analytics Hub
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  {Object.values(expandedCards).filter(Boolean).length} of {components.length} expanded
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleAllCards}
              className={`group relative overflow-hidden rounded-2xl px-8 py-4 font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                showAll 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25'
              }`}
              style={{ boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center gap-3">
                {showAll ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                <span>{showAll ? 'Minimize All' : 'Expand All'}</span>
              </div>
            </button>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
            {components.map((componentData) => (
              <CollapsibleCard
                key={componentData.id}
                {...componentData}
              />
            ))}
          </div>

          {/* Footer Summary */}
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Your Analytics Command Center
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Each card above contains detailed insights about your performance. 
                <span className="font-semibold"> Expand individual sections</span> to explore specific metrics, 
                or use <span className="font-semibold">"Expand All"</span> to see everything at once.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
