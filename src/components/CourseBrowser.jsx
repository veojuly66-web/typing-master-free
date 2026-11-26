import React, { useState } from 'react';
import { COURSES } from '../data/courses';
import { Check, ArrowRight, Play } from 'lucide-react';

export default function CourseBrowser({ completedLessons = {}, onStartLesson }) {
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  // Find the first unfinished lesson in the whole curriculum to highlight as "next"
  const allLessons = COURSES.flatMap(c => c.lessons);
  const nextUnfinishedLesson = allLessons.find(l => !completedLessons[l.id]) || allLessons[0];

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
          Touch Typing Lessons
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
          Four structured courses covering 30 progressive drills. Learn the home row, build speed with common words, and master numbers and symbols.
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Level List */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted px-1 mb-2">
            Levels
          </div>

          {COURSES.map((course, idx) => {
            const isSelected = course.id === selectedCourseId;
            const completedCount = course.lessons.filter(l => completedLessons[l.id]).length;
            const progressPct = Math.round((completedCount / course.lessons.length) * 100);

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full text-left p-4 rounded-card border transition-all ${
                  isSelected
                    ? 'bg-paper-surface border-accent shadow-subtle ring-1 ring-accent'
                    : 'bg-paper-surface border-paper-border hover:border-ink-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">
                    Level 0{idx + 1} · {course.badge}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    {completedCount}/{course.lessons.length}
                  </span>
                </div>

                <h2 className="text-sm font-semibold text-ink mb-1">
                  {course.title}
                </h2>

                <p className="text-xs text-ink-muted line-clamp-2 mb-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Quiet progress bar */}
                <div className="w-full bg-paper border border-paper-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-300"
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
              <h2 className="text-lg font-semibold text-ink">{selectedCourse.title}</h2>
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
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">
                            Next
                          </span>
                        )}
                      </div>

                      {/* Real Keys Chips or Review Tag */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {lesson.isReview ? (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-paper border border-paper-border text-ink-muted font-medium">
                            {lesson.reviewLabel || 'Review'}
                          </span>
                        ) : lesson.keysTaught && lesson.keysTaught.length > 0 ? (
                          <>
                            <span className="text-[11px] text-ink-muted">Keys:</span>
                            {lesson.keysTaught.map((k, kIdx) => (
                              <span
                                key={kIdx}
                                className="px-1.5 py-0.5 rounded bg-paper border border-paper-border font-mono text-[11px] text-ink"
                              >
                                {k === ' ' ? 'Space' : k}
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-paper border border-paper-border text-ink-muted font-medium">
                            Practice
                          </span>
                        )}

                        <span className="text-ink-muted text-xs mx-1">·</span>
                        <span className="text-[11px] text-ink-muted">Target: {lesson.targetWpm} WPM</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {isCompleted ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span className="font-mono">{result.netWpm} WPM</span>
                        </span>
                        <div className="text-[10px] text-ink-muted font-mono">{result.accuracy}% acc</div>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-muted hidden sm:inline font-mono">
                        —
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onStartLesson(lesson)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                        isNext
                          ? 'bg-accent hover:bg-accent-hover text-white shadow-subtle'
                          : 'bg-paper hover:bg-paper-border/60 text-ink border border-paper-border'
                      }`}
                    >
                      <Play className="w-3 h-3" />
                      <span>{isCompleted ? 'Retry' : 'Start'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
