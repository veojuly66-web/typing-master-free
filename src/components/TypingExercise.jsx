import React from 'react';
import TypingEngine from './typing/TypingEngine';

export default function TypingExercise({
  text = '',
  title = 'Typing Exercise',
  intro = '',
  targetWpm = 30,
  targetAccuracy = 95,
  layout = 'us',
  onComplete,
  onExit,
  onFocusChange
}) {
  return (
    <TypingEngine
      text={text}
      title={title}
      intro={intro}
      targetWpm={targetWpm}
      targetAccuracy={targetAccuracy}
      layout={layout}
      mode="lesson"
      onComplete={onComplete}
      onExit={onExit}
      onFocusChange={onFocusChange}
    />
  );
}
