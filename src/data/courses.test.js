import { describe, it, expect } from 'vitest';
import { COURSES, ENGLISH_COURSES, INSCRIPT_COURSES, REMINGTON_COURSES, getCoursesByTrack } from './courses';

describe('Courses Curriculum Suite', () => {
  it('contains all 3 tracks: English, Hindi Inscript, Hindi Remington Gail', () => {
    expect(ENGLISH_COURSES.length).toBe(5);
    expect(INSCRIPT_COURSES.length).toBe(6);
    expect(REMINGTON_COURSES.length).toBe(6);
    expect(COURSES.length).toBe(17);
  });

  it('getCoursesByTrack filters correctly', () => {
    expect(getCoursesByTrack('english')).toBe(ENGLISH_COURSES);
    expect(getCoursesByTrack('inscript')).toBe(INSCRIPT_COURSES);
    expect(getCoursesByTrack('remington')).toBe(REMINGTON_COURSES);
  });

  it('verifies that levels 1 and 2 are free and levels 3+ are Pro across all tracks', () => {
    COURSES.forEach(course => {
      if (course.level <= 2) {
        expect(course.isPro).toBe(false);
        course.lessons.forEach(lesson => {
          expect(lesson.isPro).toBe(false);
        });
      } else {
        expect(course.isPro).toBe(true);
        course.lessons.forEach(lesson => {
          expect(lesson.isPro).toBe(true);
        });
      }
    });
  });

  it('verifies each lesson has non-empty content, title, targetWpm, and valid track', () => {
    const allLessons = COURSES.flatMap(c => c.lessons);
    expect(allLessons.length).toBe(76);

    const ids = new Set();
    allLessons.forEach(lesson => {
      expect(ids.has(lesson.id)).toBe(false); // unique IDs
      ids.add(lesson.id);
      expect(lesson.title.trim().length).toBeGreaterThan(0);
      expect(lesson.content.trim().length).toBeGreaterThan(0);
      expect(lesson.targetWpm).toBeGreaterThan(0);
      expect(['english', 'inscript', 'remington']).toContain(lesson.track);
    });
  });
});
