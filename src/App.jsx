import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CourseBrowser from './components/CourseBrowser';
import TypingExercise from './components/TypingExercise';
import LessonResultModal from './components/LessonResultModal';
import TypingTest from './components/TypingTest';
import GamesHub from './components/games/GamesHub';
import CustomPractice from './components/CustomPractice';
import StatsDashboard from './components/StatsDashboard';
import { COURSES } from './data/courses';
import { Crown, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('courses');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_completed_lessons') || '{}');
    } catch (e) {
      return {};
    }
  });

  // Save progress
  const saveLessonProgress = (lessonId, stats) => {
    setCompletedLessons(prev => {
      const existing = prev[lessonId];
      // Keep best score
      const best = existing ? {
        netWpm: Math.max(existing.netWpm, stats.netWpm),
        grossWpm: Math.max(existing.grossWpm, stats.grossWpm),
        accuracy: Math.max(existing.accuracy, stats.accuracy),
        timeSeconds: stats.timeSeconds,
        passed: stats.passed || existing.passed,
        completedAt: new Date().toISOString()
      } : {
        ...stats,
        completedAt: new Date().toISOString()
      };

      const updated = { ...prev, [lessonId]: best };
      try {
        localStorage.setItem('tm_completed_lessons', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    setExerciseResult(null);
    setActiveTab('exercise');
  };

  const handleExerciseComplete = (stats) => {
    if (currentLesson) {
      saveLessonProgress(currentLesson.id, stats);
    }
    setExerciseResult(stats);
  };

  const handleRetryLesson = () => {
    setExerciseResult(null);
  };

  const handleExitExercise = () => {
    setCurrentLesson(null);
    setExerciseResult(null);
    setActiveTab('courses');
  };

  // Find next lesson
  const allLessons = COURSES.flatMap(c => c.lessons);
  const currentLessonIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const hasNextLesson = currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson);
      setExerciseResult(null);
    } else {
      handleExitExercise();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab === 'exercise' ? 'courses' : activeTab}
        setActiveTab={(tab) => {
          if (activeTab === 'exercise') {
            setCurrentLesson(null);
            setExerciseResult(null);
          }
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'courses' && (
          <CourseBrowser
            completedLessons={completedLessons}
            onStartLesson={handleStartLesson}
          />
        )}

        {activeTab === 'exercise' && currentLesson && (
          <div className="py-6">
            <TypingExercise
              key={currentLesson.id + (exerciseResult ? '-retry' : '')}
              text={currentLesson.content}
              title={currentLesson.title}
              intro={currentLesson.intro}
              targetWpm={currentLesson.targetWpm}
              targetAccuracy={currentLesson.targetAccuracy}
              onComplete={handleExerciseComplete}
              onExit={handleExitExercise}
            />

            {exerciseResult && (
              <LessonResultModal
                stats={exerciseResult}
                lessonTitle={currentLesson.title}
                onNext={hasNextLesson ? handleNextLesson : null}
                onRetry={handleRetryLesson}
                onCourseList={handleExitExercise}
                hasNextLesson={hasNextLesson}
              />
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <TypingTest onBack={() => setActiveTab('courses')} />
        )}

        {activeTab === 'games' && (
          <GamesHub />
        )}

        {activeTab === 'custom' && (
          <CustomPractice onStartCustom={handleStartLesson} />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard
            completedLessons={completedLessons}
            onSelectLesson={handleStartLesson}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Pankaj Typing Pro</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">100% Free Lifetime Touch Typing Academy</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>Home Row Standard</span>
            <span>Audio Synthesizer SFX</span>
            <span>Official Certificates</span>
            <span>Arcade Games</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
