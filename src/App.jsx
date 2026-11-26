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
import { AuthProvider, useAuth } from './lib/auth';
import { I18nProvider } from './i18n';
import { BRAND } from './config/brand';
import ProLock from './components/ui/ProLock';

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

// SaaS & Exam Additions
const Pricing = lazy(() => import('./components/Pricing'));
const ExamSimulator = lazy(() => import('./components/exams/ExamSimulator'));
const ExamHub = lazy(() => import('./components/exams/ExamHub'));
const ExamDetailPage = lazy(() => import('./components/exams/ExamDetailPage'));
const Login = lazy(() => import('./components/auth/Login'));
const Account = lazy(() => import('./components/auth/Account'));
const Checkout = lazy(() => import('./components/checkout/Checkout'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const CertificateVerify = lazy(() => import('./components/CertificateVerify'));
const RefundPolicy = lazy(() => import('./components/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./components/ShippingPolicy'));

function parseRouteFromHash() {
  const rawWithQuery = window.location.hash.replace(/^#\/?/, '').trim();
  const raw = rawWithQuery.split('?')[0];
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
    case 'pricing':
      return { page: 'pricing' };
    case 'exams':
      return param ? { page: 'exam-detail', slug: param } : { page: 'exams' };
    case 'exam-simulator':
      return { page: 'exams' };
    case 'login':
      return { page: 'login' };
    case 'account':
      return { page: 'account' };
    case 'checkout':
      return { page: 'checkout' };
    case 'admin':
      return { page: 'admin' };
    case 'verify':
      return { page: 'verify', certId: param || null };
    case 'refund-policy':
      return { page: 'refund-policy' };
    case 'shipping-policy':
      return { page: 'shipping-policy' };
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
  home: `${BRAND.name} — ${BRAND.tagline}`,
  lessons: `Courses & Lessons — ${BRAND.name}`,
  placement: `Placement Diagnostic — ${BRAND.name}`,
  test: `Typing Speed Test — ${BRAND.name}`,
  games: `Arcade Typing Games — ${BRAND.name}`,
  practice: `Adaptive Practice Studio — ${BRAND.name}`,
  progress: `Progress & Analytics — ${BRAND.name}`,
  pricing: `Plans & Pricing — ${BRAND.name}`,
  exams: `Government Exam Simulator — ${BRAND.name}`,
  'exam-detail': `Exam Guide & Syllabus — ${BRAND.name}`,
  login: `Sign In — ${BRAND.name}`,
  account: `My Account — ${BRAND.name}`,
  checkout: `Checkout & Activation — ${BRAND.name}`,
  admin: `Admin Console — ${BRAND.name}`,
  verify: `Certificate Verification — ${BRAND.name}`,
  'refund-policy': `Refund & Cancellation Policy — ${BRAND.name}`,
  'shipping-policy': `Shipping & Digital Delivery — ${BRAND.name}`,
  settings: `Settings — ${BRAND.name}`,
  about: `About Us — ${BRAND.name}`,
  privacy: `Privacy Policy — ${BRAND.name}`,
  terms: `Terms & Conditions — ${BRAND.name}`,
  contact: `Contact Support — ${BRAND.name}`,
  certificate: `Certificate of Typing Speed — ${BRAND.name}`,
  notfound: `Page Not Found — ${BRAND.name}`,
};

function MainApp() {
  const { isProUser } = useAuth();
  const [routeInfo, setRouteInfo] = useState(parseRouteFromHash);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [isTypingFocused, setIsTypingFocused] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('tm_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('tm_theme', isDark ? 'dark' : 'light');
    } catch (e) {}
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Hash listener & title updater
  useEffect(() => {
    const handleHashChange = () => {
      const info = parseRouteFromHash();
      setRouteInfo(info);
      document.title = PAGE_TITLES[info.page] || PAGE_TITLES.home;

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
    document.title = PAGE_TITLES[routeInfo.page] || PAGE_TITLES.home;

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mousemove or Escape resets typing focus
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
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-150 font-sans">
      {/* Top Navbar */}
      <div className={isTypingFocused ? 'opacity-20 transition-opacity duration-300 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : 'transition-opacity duration-300'}>
        <Navbar
          currentRoute={routeInfo.page}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Content View */}
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
              currentLesson.isPro && !isProUser ? (
                <div className="max-w-md mx-auto py-12 px-4">
                  <ProLock
                    title={`"${currentLesson.title}" is a Pro Drill`}
                    description="This lesson requires an active Pro subscription or 7-day free trial. Unlock all 76 English & Hindi lessons today."
                    onUnlock={() => { window.location.hash = '#/pricing'; }}
                  />
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleExitExercise}
                      className="text-xs text-text-muted hover:text-text font-medium underline underline-offset-2"
                    >
                      ← Return to all lessons
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <TypingExercise
                    key={currentLesson.id + (exerciseResult ? '-retry' : '')}
                    text={currentLesson.content}
                    title={currentLesson.title}
                    intro={currentLesson.intro}
                    targetWpm={currentLesson.targetWpm}
                    targetAccuracy={currentLesson.targetAccuracy}
                    layout={currentLesson.track === 'inscript' ? 'inscript' : currentLesson.track === 'remington' ? 'remington-gail' : 'us'}
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
              )
            ) : (
              <CourseBrowser
                completedLessons={completedLessons}
                onStartLesson={handleStartLesson}
              />
            )}
          </>
        )}

        {routeInfo.page === 'exams' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading exam simulator...</div>}>
            <ExamSimulator />
          </Suspense>
        )}

        {routeInfo.page === 'exam-detail' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading exam guide...</div>}>
            <ExamDetailPage slug={routeInfo.slug} />
          </Suspense>
        )}

        {routeInfo.page === 'placement' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading placement diagnostic...</div>}>
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

        {routeInfo.page === 'pricing' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading pricing plans...</div>}>
            <Pricing />
          </Suspense>
        )}

        {routeInfo.page === 'login' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading login...</div>}>
            <Login />
          </Suspense>
        )}

        {routeInfo.page === 'account' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading account...</div>}>
            <Account />
          </Suspense>
        )}

        {routeInfo.page === 'checkout' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading checkout...</div>}>
            <Checkout />
          </Suspense>
        )}

        {routeInfo.page === 'admin' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading admin desk...</div>}>
            <AdminPanel />
          </Suspense>
        )}

        {routeInfo.page === 'verify' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading verification...</div>}>
            <CertificateVerify certId={routeInfo.certId} />
          </Suspense>
        )}

        {routeInfo.page === 'refund-policy' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading policy...</div>}>
            <RefundPolicy />
          </Suspense>
        )}

        {routeInfo.page === 'shipping-policy' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading policy...</div>}>
            <ShippingPolicy />
          </Suspense>
        )}

        {routeInfo.page === 'games' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading arcade games...</div>}>
            <GamesHub initialGameId={routeInfo.gameId} />
          </Suspense>
        )}

        {routeInfo.page === 'practice' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading adaptive practice studio...</div>}>
            <AdaptivePractice
              onStartDrill={(drill) => {
                handleStartLesson(drill);
              }}
              onFocusChange={setIsTypingFocused}
            />
          </Suspense>
        )}

        {routeInfo.page === 'progress' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading your progress & analytics...</div>}>
            <ProgressDashboard
              onSelectLesson={handleStartLesson}
            />
          </Suspense>
        )}

        {routeInfo.page === 'settings' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading settings...</div>}>
            <Settings />
          </Suspense>
        )}

        {routeInfo.page === 'certificate' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading certificate...</div>}>
            <CertificateModal
              stats={{ netWpm: 52, grossWpm: 55, accuracy: 98, duration: 60 }}
              testTitle="1-Minute Benchmark Speed Test"
              onClose={() => { window.location.hash = '#/progress'; }}
            />
          </Suspense>
        )}

        {routeInfo.page === 'about' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading...</div>}>
            <About />
          </Suspense>
        )}

        {routeInfo.page === 'privacy' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading...</div>}>
            <Privacy />
          </Suspense>
        )}

        {routeInfo.page === 'terms' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading...</div>}>
            <Terms />
          </Suspense>
        )}

        {routeInfo.page === 'contact' && (
          <Suspense fallback={<div className="max-w-content mx-auto py-16 text-center text-xs text-text-muted">Loading...</div>}>
            <Contact />
          </Suspense>
        )}

        {routeInfo.page === 'notfound' && <NotFound />}
      </main>

      {/* 4-column Footer */}
      <div className={isTypingFocused ? 'opacity-20 transition-opacity duration-300 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : 'transition-opacity duration-300'}>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <MainApp />
      </I18nProvider>
    </AuthProvider>
  );
}
