/**
 * Subscription & Entitlement Checker
 */

export function isPro(subscription) {
  if (!subscription) return false;
  const status = subscription.status;
  if (status === 'active') {
    const end = new Date(subscription.current_period_end).getTime();
    return end > Date.now();
  }
  if (status === 'trialing') {
    const trialEnd = new Date(subscription.trial_end || subscription.current_period_end).getTime();
    return trialEnd > Date.now();
  }
  return false;
}

export function isTrial(subscription) {
  if (!subscription) return false;
  return subscription.status === 'trialing';
}

export function getTrialDaysLeft(subscription) {
  if (!subscription || subscription.status !== 'trialing') return 0;
  const end = new Date(subscription.trial_end || subscription.current_period_end).getTime();
  const diffMs = end - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function canAccessLesson(lesson, subscription) {
  if (!lesson) return false;
  if (!lesson.isPro) return true;
  return isPro(subscription);
}

export function canAccessExam(exam, subscription) {
  if (!exam) return false;
  if (exam.isFreePreview) return true;
  return isPro(subscription);
}
