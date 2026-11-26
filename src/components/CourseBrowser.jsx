import React, { useState } from 'react';
import { COURSES, getCoursesByTrack } from '../data/courses';
import { useAuth } from '../lib/auth';
import { Check, ArrowRight, Play, Lock, Globe, X } from 'lucide-react';
import PlanBadge from './ui/PlanBadge';
import ProLock from './ui/ProLock';

const TRACKS = [
  { id: 'english', label: 'English (QWERTY)', sublabel: 'Standard Touch Typing', icon: 'EN' },
  { id: 'inscript', label: 'Hindi Inscript (मानक इंस्क्रिप्ट)', sublabel: 'BIS Standard · CPCT / SSC', icon: 'हि' },
  { id: 'remington', label: 'Hindi Remington Gail (रेमिंगटन गेल)', sublabel: 'Krutidev · High Court / Clerk', icon: 'रे' },
];

export default function CourseBrowser({ completedLessons = {}, onStartLesson }) {
  const [currentTrack, setCurrentTrack] = useState('english');
  const { isProUser, subscription } = useAuth();
  const [proModalLesson, setProModalLesson] = useState(null);

  const trackCourses = getCoursesByTrack(currentTrack);
  const [selectedCourseId, setSelectedCourseId] = useState(trackCourses[0]?.id || 'course-basics');

  const selectedCourse = trackCourses.find(c => c.id === selectedCourseId) || trackCourses[0] || COURSES[0];

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
    const newCourses = getCoursesByTrack(trackId);
    if (newCourses.length > 0) {
      setSelectedCourseId(newCourses[0].id);
    }
  };

  // Find the first unfinished lesson in the current track to highlight as "next"
  const trackLessons = trackCourses.flatMap(c => c.lessons);
  const nextUnfinishedLesson = trackLessons.find(l => !completedLessons[l.id]) || trackLessons[0];

  const handleLessonClick = (lesson) => {
    if (lesson.isPro && !isProUser) {
      setProModalLesson(lesson);
      return;
    }
    onStartLesson(lesson);
  };

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
              Touch Typing Lessons & Courses
            </h1>
            <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
              Progressive drills from finger placement to speed mastery. Choose between English and government-standard Hindi typing layouts.
            </p>
          </div>

          <div className="shrink-0">
            <span className="text-xs px-2.5 py-1 rounded bg-surface-2 border border-border text-text-muted font-medium inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span>3 Typing Tracks · 76 Lessons</span>
            </span>
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-paper-border">
          {TRACKS.map(track => {
            const isActive = currentTrack === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleTrackChange(track.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-medium transition-colors duration-150 whitespace-nowrap border ${
                  isActive
                    ? 'bg-ink text-paper border-ink shadow-subtle'
                    : 'bg-paper-surface border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-key flex items-center justify-center text-[10px] font-semibold ${
                  isActive ? 'bg-paper text-ink' : 'bg-surface-2 text-text-muted'
                }`}>
                  {track.icon}
                </span>
                <div className="text-left">
                  <div className="font-semibold leading-tight">{track.label}</div>
                  <div className={`text-[10px] opacity-75 hidden sm:block ${isActive ? 'text-paper/80' : 'text-text-muted'}`}>
                    {track.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Level List */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-ink-muted px-1 mb-2">
            <span>Levels ({trackCourses.length})</span>
            <span className="text-2xs font-normal">Levels 1–2 free · 3+ Pro</span>
          </div>

          {trackCourses.map((course, idx) => {
            const isSelected = course.id === selectedCourseId;
            const completedCount = course.lessons.filter(l => completedLessons[l.id]).length;
            const progressPct = Math.round((completedCount / course.lessons.length) * 100);

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full text-left p-4 rounded-card border transition-colors duration-150 ${
                  isSelected
                    ? 'bg-paper-surface border-accent shadow-subtle ring-1 ring-accent'
                    : 'bg-paper-surface border-paper-border hover:border-ink-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ink-muted">
                      Level 0{course.level} · {course.badge}
                    </span>
                    {course.isPro && !isProUser && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-key text-[10px] font-semibold bg-pro-soft text-pro border border-pro/20">
                        <Lock className="w-2.5 h-2.5" strokeWidth={1.5} />
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-ink-muted">
                    {completedCount}/{course.lessons.length}
                  </span>
                </div>

                <h2 className="text-sm font-semibold text-ink mb-1">
                  {course.title}
                </h2>

                <p className="text-xs text-ink-muted line-clamp-2 mb-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-paper border border-paper-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-[width] duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Column: Compact Lesson Rows */}
        <section className="lg:col-span-8 bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-border">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-ink">{selectedCourse.title}</h2>
                {selectedCourse.isPro && !isProUser && (
                  <PlanBadge plan="pro" />
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{selectedCourse.description}</p>
            </div>
            <span className="text-xs text-ink-muted font-mono shrink-0">
              {selectedCourse.lessons.length} lessons
            </span>
          </div>

          <div className="divide-y divide-paper-border">
            {selectedCourse.lessons.map((lesson, idx) => {
              const result = completedLessons[lesson.id];
              const isCompleted = !!result;
              const isNext = nextUnfinishedLesson?.id === lesson.id;
              const isLocked = lesson.isPro && !isProUser;

              return (
                <div
                  key={lesson.id}
                  className={`py-3.5 px-3 rounded-card transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isNext ? 'bg-accent-soft/50 border border-accent/30' : 'hover:bg-paper'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-ink-muted w-6 pt-0.5 shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-ink">
                          {lesson.title}
                        </h3>
                        {isNext && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-key bg-accent text-white font-medium">
                            Next
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-key text-[10px] font-semibold bg-pro-soft text-pro border border-pro/20">
                            <Lock className="w-2.5 h-2.5" strokeWidth={1.5} />
                            Pro
                          </span>
                        )}
                      </div>

                      {/* Real Keys Chips or Review Tag */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {lesson.isReview ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-key bg-paper border border-paper-border text-ink-muted font-medium">
                            {lesson.reviewLabel || 'Review'}
                          </span>
                        ) : lesson.keysTaught && lesson.keysTaught.length > 0 ? (
                          <>
                            <span className="text-[11px] text-ink-muted">Keys</span>
                            {lesson.keysTaught.map((k, kIdx) => (
                              <span
                                key={kIdx}
                                className="keycap px-1.5 py-0.5 font-mono text-[11px] text-ink"
                              >
                                {k === ' ' ? 'Space' : k}
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-key bg-paper border border-paper-border text-ink-muted font-medium">
                            Practice
                          </span>
                        )}

                        <span className="text-ink-muted text-xs mx-1">·</span>
                        <span className="text-[11px] text-ink-muted tabular-nums">Target {lesson.targetWpm} WPM</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {isCompleted ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                          <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span className="font-mono tabular-nums">{result.netWpm} WPM</span>
                        </span>
                        <div className="text-[10px] text-ink-muted font-mono tabular-nums">{result.accuracy}% acc</div>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-muted hidden sm:inline font-mono">
                        —
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLessonClick(lesson)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                        isLocked
                          ? 'bg-pro-soft hover:bg-pro-soft/80 text-pro border border-pro/30'
                          : isNext
                          ? 'bg-accent hover:bg-accent-hover text-white shadow-subtle'
                          : 'bg-paper hover:bg-paper-border/60 text-ink border border-paper-border'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3 h-3 text-pro" strokeWidth={1.5} />
                          <span>Unlock</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" strokeWidth={1.5} />
                          <span>{isCompleted ? 'Retry' : 'Start'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Pro Unlock Modal */}
      {proModalLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 animate-fade-in">
          <div className="relative max-w-md w-full bg-surface border border-border rounded-modal p-6 shadow-overlay">
            <button
              type="button"
              onClick={() => setProModalLesson(null)}
              className="absolute top-4 right-4 p-1 rounded-btn hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <ProLock
              title={`Unlock "${proModalLesson.title}"`}
              description="This lesson is part of the Pro curriculum. Upgrade to get full access to all 76 English & Hindi lessons, official exam simulator, and verified certificates."
              onUnlock={() => {
                setProModalLesson(null);
                window.location.hash = '#/pricing';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
