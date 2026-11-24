import React, { useState } from 'react';
import { COURSES } from '../data/courses';
import { BookOpen, CheckCircle, ChevronRight, Play, Zap, Target, Lock, Unlock, Sparkles, Award } from 'lucide-react';

export default function CourseBrowser({ completedLessons = {}, onStartLesson }) {
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Structured Touch Typing Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Pankaj Typing Step-by-Step Courses
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
            From complete beginner on the Home Row to 80+ WPM typing virtuoso. Every lesson is interactive with real-time finger placement guidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Lessons</div>
            <div className="text-xl font-black text-white font-mono">
              {COURSES.reduce((acc, c) => acc + c.lessons.length, 0)}
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Unlocked</div>
            <div className="text-xl font-black text-emerald-400 font-mono">100% Free</div>
          </div>
        </div>
      </div>

      {/* Courses Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {COURSES.map(course => {
          const isSelected = course.id === selectedCourseId;
          const courseCompletedCount = course.lessons.filter(l => completedLessons[l.id]).length;
          const progressPct = Math.round((courseCompletedCount / course.lessons.length) * 100);

          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 shadow-xl shadow-blue-500/15 ring-2 ring-blue-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Badge & Lessons count */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {course.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {courseCompletedCount}/{course.lessons.length}
                </span>
              </div>

              <h3 className="font-bold text-white text-base tracking-tight mb-1 group-hover:text-blue-300 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Course Lessons List */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Active Course</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{selectedCourse.lessons.length} Interactive Drills</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{selectedCourse.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{selectedCourse.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Lifetime PRO: All Unlocked</span>
          </div>
        </div>

        {/* Lessons Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCourse.lessons.map((lesson, idx) => {
            const result = completedLessons[lesson.id];
            const isCompleted = !!result;

            return (
              <div
                key={lesson.id}
                className="bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Lesson {idx + 1}
                    </span>
                    
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        <span>{result.netWpm} WPM • {result.accuracy}%</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                        Target: {lesson.targetWpm} WPM
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base tracking-tight group-hover:text-blue-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {lesson.intro}
                  </p>

                  {/* Keys taught pill */}
                  {lesson.keysTaught && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      <span className="text-[10px] text-slate-500 font-medium">Keys:</span>
                      {lesson.keysTaught.slice(0, 8).map((k, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                          {k === ' ' ? 'Space' : k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    ~{Math.round(lesson.content.length / 5)} words
                  </span>

                  <button
                    onClick={() => onStartLesson(lesson)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all group-hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isCompleted ? 'Practice Again' : 'Start Lesson'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
