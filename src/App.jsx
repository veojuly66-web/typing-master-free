import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import CourseBrowser from './components/CourseBrowser';
import TypingExercise from './components/TypingExercise';
import LessonResultModal from './components/LessonResultModal';
import TypingTest from './components/TypingTest';
import NotFound from './components/NotFound';
import { COURSES } from './data/courses';
import { Storage } from './lib/storage';

// Lazy-load sub-routes to shrink the main bundle
const PlacementTest = lazy(() => import('./components/PlacementTest'));
const AdaptivePractice = lazy(() => import('./components/AdaptivePractice'));
const ProgressDashboard = lazy(() => import('./components/ProgressDashboard'));
const Settings = lazy(() => import('./components/Settings'));
const GamesHub = lazy(() => import('./components/games/GamesHub'));
const CertificateModal = lazy(() => import('./components/CertificateModal'));
const About = lazy(() => import('./components/About'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const Contact = lazy(() => import('./components/Contact'));

function parseRouteFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return { page: 'home' };

  const [base, param] = raw.split('/');

  switch (base) {
    case '':
    case 'home':
      return { page: 'home' };
    case 'lessons':
      return { page: 'lessons', lessonId: param || null };
    case 'placement':
      return { page: 'placement' };
    case 'test':
      return { page: 'test' };
    case 'games':
      return { page: 'games', gameId: param || null };
    case 'practice':
      return { page: 'practice' };
    case 'progress':
      return { page: 'progress' };
    case 'settings':
      return { page: 'settings' };
    case 'about':
      return { page: 'about' };
    case 'privacy':
      return { page: 'privacy' };
    case 'terms':
      return { page: 'terms' };
    case 'contact':
      return { page: 'contact' };
    case 'certificate':
      return { page: 'certificate', certId: param || null };
    default:
      return { page: 'notfound' };
  }
}

const PAGE_TITLES = {
  home: 'Pankaj Typing — Free Touch Typing Lessons & Speed Test',
  lessons: 'Lessons — Pankaj Typing',
  placement: 'Placement Diagnostic — Pankaj Typing',
  test: 'Speed Test — Pankaj Typing',
  games: 'Arcade Games — Pankaj Typing',
  practice: 'Adaptive Practice — Pankaj Typing',
  progress: 'Your Progress & Stats — Pankaj Typing',
  settings: 'Settings — Pankaj Typing',
  about: 'About — Pankaj Typing',
  privacy: 'Privacy Policy — Pankaj Typing',
  terms: 'Terms of Service — Pankaj Typing',
  contact: 'Contact Support — Pankaj Typing',
  certificate: 'Certificate of Typing Speed — Pankaj Typing',
  notfound: 'Page Not Found — Pankaj Typing',
};

export default function App() {
  const [routeInfo, setRouteInfo] = useState(parseRouteFromHash);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [isTypingFocused, setIsTypingFocused] = useState(false);

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

  // Hash change routing listener & document title updater
  useEffect(() => {
    const handleHashChange = () => {
      const info = parseRouteFromHash();
      setRouteInfo(info);
      document.title = PAGE_TITLES[info.page] || PAGE_TITLES.home;

      // Handle direct lesson route: #/lessons/:id
      if (info.page === 'lessons' && info.lessonId) {
        const found = COURSES.flatMap(c => c.lessons).find(l => l.id === info.lessonId);
        if (found) {
          setCurrentLesson(found);
          setExerciseResult(null);
        }
      } else if (info.page !== 'lessons') {
        setCurrentLesson(null);
        setExerciseResult(null);
      }

      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial title
    document.title = PAGE_TITLES[routeInfo.page] || PAGE_TITLES.home;

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mousemove or Escape resets typing focus mode
  useEffect(() => {
    const handleActivity = (e) => {
      if (e.type === 'keydown' && e.key === 'Escape') {
        setIsTypingFocused(false);
      } else if (e.type === 'mousemove') {
        setIsTypingFocused(false);
      }
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Lessons progress from Storage
  const [completedLessons, setCompletedLessons] = useState(() => Storage.getCompletedLessons());

  const saveLessonProgress = (lessonId, stats) => {
    const updated = Storage.saveLessonProgress(lessonId, stats);
    setCompletedLessons(updated);
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    setExerciseResult(null);
    window.location.hash = `#/lessons/${lesson.id}`;
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
    window.location.hash = '#/lessons';
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
      window.location.hash = `#/lessons/${next.id}`;
    } else {
      handleExitExercise();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-150">
      {/* Top Navbar with focus fade */}
      <div className={isTypingFocused ? 'opacity-20 transition-opacity duration-300 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : 'transition-opacity duration-300'}>
        <Navbar
          currentRoute={routeInfo.page}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {routeInfo.page === 'home' && (
          <Home
            completedLessons={completedLessons}
            onNavigate={(newRoute) => {
              window.location.hash = `#/${newRoute}`;
            }}
          />
        )}

        {routeInfo.page === 'lessons' && (
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
                  onFocusChange={setIsTypingFocused}
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

        {routeInfo.page === 'placement' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading placement diagnostic...</div>}>
            <PlacementTest
              onStartLevel={(lessonId) => {
                const target = COURSES.flatMap(c => c.lessons).find(l => l.id === lessonId) || COURSES[0].lessons[0];
                handleStartLesson(target);
              }}
              onFocusChange={setIsTypingFocused}
            />
          </Suspense>
        )}

        {routeInfo.page === 'test' && (
          <TypingTest
            onBack={() => { window.location.hash = '#/lessons'; }}
            onFocusChange={setIsTypingFocused}
          />
        )}

        {routeInfo.page === 'games' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading arcade games...</div>}>
            <GamesHub initialGameId={routeInfo.gameId} />
          </Suspense>
        )}

        {routeInfo.page === 'practice' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading adaptive practice studio...</div>}>
            <AdaptivePractice
              onStartDrill={(drill) => {
                handleStartLesson(drill);
              }}
              onFocusChange={setIsTypingFocused}
            />
          </Suspense>
        )}

        {routeInfo.page === 'progress' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading your progress & analytics...</div>}>
            <ProgressDashboard
              onSelectLesson={handleStartLesson}
            />
          </Suspense>
        )}

        {routeInfo.page === 'settings' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading settings...</div>}>
            <Settings />
          </Suspense>
        )}

        {routeInfo.page === 'certificate' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading certificate...</div>}>
            <CertificateModal
              stats={{ netWpm: 52, grossWpm: 55, accuracy: 98, duration: 60 }}
              testTitle="1-Minute Benchmark Speed Test"
              onClose={() => { window.location.hash = '#/progress'; }}
            />
          </Suspense>
        )}

        {routeInfo.page === 'about' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading...</div>}>
            <About />
          </Suspense>
        )}

        {routeInfo.page === 'privacy' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading...</div>}>
            <Privacy />
          </Suspense>
        )}

        {routeInfo.page === 'terms' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading...</div>}>
            <Terms />
          </Suspense>
        )}

        {routeInfo.page === 'contact' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-ink-muted">Loading...</div>}>
            <Contact />
          </Suspense>
        )}

        {routeInfo.page === 'notfound' && <NotFound />}
      </main>

      {/* 4-column Footer with focus fade */}
      <div className={isTypingFocused ? 'opacity-20 transition-opacity duration-300 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : 'transition-opacity duration-300'}>
        <Footer />
      </div>
    </div>
  );
}
