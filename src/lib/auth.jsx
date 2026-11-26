import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { isPro, getTrialDaysLeft } from './subscription';
import { Storage } from './storage';

const AuthContext = createContext({
  user: null,
  profile: null,
  subscription: null,
  loading: true,
  isProUser: false,
  trialDaysLeft: 0,
  signInWithGoogle: async () => {},
  signInWithOtp: async () => {},
  verifyOtp: async () => {},
  signOut: async () => {},
  refreshSubscription: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and subscription from Supabase
  const loadUserData = async (currentUser) => {
    if (!currentUser || !isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      setProfile(prof || null);

      // 2. Fetch Subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      setSubscription(sub || null);

      // 3. Merge guest localStorage progress if not merged yet
      mergeGuestProgress(currentUser.id);

    } catch (e) {
      console.error('Failed to load user data', e);
    } finally {
      setLoading(false);
    }
  };

  // Merge guest progress into Supabase tables upon signup
  const mergeGuestProgress = async (userId) => {
    try {
      const mergedKey = `pt_merged_${userId}`;
      if (localStorage.getItem(mergedKey)) return;

      const localLessons = Storage.getCompletedLessons();
      const entries = Object.entries(localLessons);

      const inferTrack = (lessonId) => {
        if (lessonId.startsWith('ins-')) return 'inscript';
        if (lessonId.startsWith('rem-')) return 'remington';
        return 'english';
      };

      for (const [lessonId, stats] of entries) {
        await supabase.from('lesson_progress').upsert({
          user_id: userId,
          track: inferTrack(lessonId),
          lesson_id: lessonId,
          net_wpm: stats.netWpm || 0,
          gross_wpm: stats.grossWpm || 0,
          accuracy: stats.accuracy || 100,
          stars: stats.stars || 3,
          passed: stats.passed ?? true
        }, { onConflict: 'user_id,track,lesson_id' });
      }

      localStorage.setItem(mergedKey, 'true');
    } catch (e) {
      console.warn('Guest progress merge skipped:', e);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user || null;
      setUser(u);
      if (u) {
        loadUserData(u);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user || null;
        setUser(u);
        if (u) {
          await loadUserData(u);
        } else {
          setProfile(null);
          setSubscription(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const buildRedirectUrl = (redirectHash = 'account') => {
    const cleanHash = String(redirectHash || 'account').replace(/^#\/?/, '');
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}#/${cleanHash}`;
  };

  const signInWithGoogle = async (redirectHash = 'account') => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildRedirectUrl(redirectHash)
      }
    });
  };

  const signInWithOtp = async (email, redirectHash = 'account') => {
    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: buildRedirectUrl(redirectHash)
      }
    });
  };

  const verifyOtp = async (email, token) => {
    return supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const refreshSubscription = async () => {
    if (user && isSupabaseConfigured) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setSubscription(sub || null);
    }
  };

  const isProUser = isPro(subscription);
  const trialDaysLeft = getTrialDaysLeft(subscription);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        loading,
        isProUser,
        trialDaysLeft,
        signInWithGoogle,
        signInWithOtp,
        verifyOtp,
        signOut,
        refreshSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
