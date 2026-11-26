import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import CourseBrowser from './components/CourseBrowser';
import TypingExercise from './components/TypingExercise';
import LessonResultModal from './components/LessonResultModal';
import TypingTest from './components/TypingTest';
import CustomPractice from './components/CustomPractice';
import StatsDashboard from './components/StatsDashboard';
import About from './components/About';
import Privacy from './components/Privacy';
import Contact from './components/Contact';
import { COURSES } from './data/courses';

// Lazy-load games to shrink the main bundle
const GamesHub = lazy(() => import('./components/games/GamesHub'));

function parseRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash || hash === '') return 'home';
  if (hash.startsWith('lessons')) return 'lessons';
  if (hash.startsWith('test')) return 'test';
  if (hash.startsWith('games')) return 'games';
  if (hash.startsWith('practice')) return 'practice';
  if (hash.startsWith('progress')) return 'progress';
  if (hash.startsWith('about')) return 'about';
  if (hash.startsWith('privacy')) return 'privacy';
  if (hash.startsWith('contact')) return 'contact';
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState(parseRouteFromHash);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);

  // Theme state (default light, optional dark, respect system preference and localStorage)
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('tm_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  // Apply dark class to html document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('tm_theme', isDark ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Hash change routing listener
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseRouteFromHash();
      setRoute(newRoute);
      // If navigating to another page while exercise is active, exit exercise
      if (newRoute !== 'lessons') {
        setCurrentLesson(null);
        setExerciseResult(null);
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Lessons progress from localStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_completed_lessons') || '{}');
    } catch (e) {
      return {};
    }
  });

  const saveLessonProgress = (lessonId, stats) => {
    setCompletedLessons(prev => {
      const existing = prev[lessonId];
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
    if (route !== 'lessons') {
      window.location.hash = '#/lessons';
    }
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
  };

  // Find next lesson
  const allLessons = COURSES.flatMap(c => c.lessons);
  const currentLessonIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const hasNextLesson = currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const next = allLessons[currentLessonIndex + 1];
      setCurrentLesson(next);
      setExerciseResult(null);
    } else {
      handleExitExercise();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        currentRoute={route}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {route === 'home' && (
          <Home
            completedLessons={completedLessons}
            onNavigate={(newRoute) => {
              window.location.hash = `#/${newRoute}`;
            }}
          />
        )}

        {route === 'lessons' && (
          <>
            {currentLesson ? (
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
            ) : (
              <CourseBrowser
                completedLessons={completedLessons}
                onStartLesson={handleStartLesson}
              />
            )}
          </>
        )}

        {route === 'test' && (
          <TypingTest onBack={() => { window.location.hash = '#/lessons'; }} />
        )}

        {route === 'games' && (
          <Suspense fallback={
            <div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">
              Loading arcade games...
            </div>
          }>
            <GamesHub />
          </Suspense>
        )}

        {route === 'practice' && (
          <CustomPractice onStartCustom={handleStartLesson} />
        )}

        {route === 'progress' && (
          <StatsDashboard
            completedLessons={completedLessons}
            onSelectLesson={handleStartLesson}
          />
        )}

        {route === 'about' && <About />}
        {route === 'privacy' && <Privacy />}
        {route === 'contact' && <Contact />}
      </main>

      {/* Real 3-column Footer */}
      <Footer />
    </div>
  );
}
