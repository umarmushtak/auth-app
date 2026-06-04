/**
 * Authentication Service
 * 
 * Centralized auth operations with duplicate request prevention,
 * input sanitization, and comprehensive error handling.
 * 
 * All methods return { data, error } for consistent consumption.
 */

import { supabase } from '../lib/supabase';
import { sanitizeEmail, sanitizeInput } from '../utils/validation';
import { getAuthError, logAuthError } from '../utils/errorHandler';

// ━━━ Duplicate Request Guard ━━━
const pendingRequests = new Map();

const withGuard = async (key, operation) => {
  if (pendingRequests.get(key)) {
    return { data: null, error: 'Request already in progress.' };
  }

  pendingRequests.set(key, true);

  try {
    const result = await operation();
    return result;
  } catch (error) {
    logAuthError(key, error);
    return { data: null, error: getAuthError(error) };
  } finally {
    pendingRequests.delete(key);
  }
};

// ━━━ Email/Password Sign Up ━━━
export const signUpWithEmail = async (email, password) => {
  return withGuard('signUp', async () => {
    const cleanEmail = sanitizeEmail(email);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: process.env.EXPO_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) {
      logAuthError('signUp', error);
      return { data: null, error: getAuthError(error) };
    }

    // Check if user needs email verification
    const needsVerification =
      data?.user?.identities?.length === 0 || !data?.session;

    return {
      data: {
        user: data.user,
        session: data.session,
        needsVerification,
      },
      error: null,
    };
  });
};

// ━━━ Email/Password Sign In ━━━
export const signInWithEmail = async (email, password) => {
  return withGuard('signIn', async () => {
    const cleanEmail = sanitizeEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      logAuthError('signIn', error);
      return { data: null, error: getAuthError(error) };
    }

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  });
};

// ━━━ Google OAuth Sign In ━━━
export const signInWithGoogle = async (idToken) => {
  return withGuard('googleSignIn', async () => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      logAuthError('googleSignIn', error);
      return { data: null, error: getAuthError(error) };
    }

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  });
};

// ━━━ Google OAuth (Web — Supabase redirect flow) ━━━
export const signInWithGoogleOAuth = async () => {
  return withGuard('googleOAuth', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      logAuthError('googleOAuth', error);
      return { data: null, error: getAuthError(error) };
    }

    // On web this redirects the browser to Google's consent screen.
    // After consent, Google redirects back and Supabase handles the session.
    return { data, error: null };
  });
};

// ━━━ Forgot Password ━━━
export const sendPasswordResetEmail = async (email) => {
  return withGuard('resetPassword', async () => {
    const cleanEmail = sanitizeEmail(email);

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: process.env.EXPO_PUBLIC_REDIRECT_URL,
    });

    if (error) {
      logAuthError('resetPassword', error);
      return { data: null, error: getAuthError(error) };
    }

    return {
      data: { message: 'Password reset email sent.' },
      error: null,
    };
  });
};

// ━━━ Update Password (after reset) ━━━
export const updatePassword = async (newPassword) => {
  return withGuard('updatePassword', async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logAuthError('updatePassword', error);
      return { data: null, error: getAuthError(error) };
    }

    return {
      data: { user: data.user },
      error: null,
    };
  });
};

// ━━━ Resend Verification Email ━━━
export const resendVerificationEmail = async (email) => {
  return withGuard('resendVerification', async () => {
    const cleanEmail = sanitizeEmail(email);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: process.env.EXPO_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) {
      logAuthError('resendVerification', error);
      return { data: null, error: getAuthError(error) };
    }

    return {
      data: { message: 'Verification email resent.' },
      error: null,
    };
  });
};

// ━━━ Sign Out ━━━
export const signOut = async () => {
  return withGuard('signOut', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logAuthError('signOut', error);
      return { data: null, error: getAuthError(error) };
    }

    return { data: { message: 'Signed out successfully.' }, error: null };
  });
};

// ━━━ Get Current Session ━━━
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      logAuthError('getSession', error);
      return { session: null, error: getAuthError(error) };
    }

    return { session, error: null };
  } catch (error) {
    logAuthError('getSession', error);
    return { session: null, error: getAuthError(error) };
  }
};

// ━━━ Get Current User ━━━
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      logAuthError('getUser', error);
      return { user: null, error: getAuthError(error) };
    }

    return { user, error: null };
  } catch (error) {
    logAuthError('getUser', error);
    return { user: null, error: getAuthError(error) };
  }
};

// ━━━ Refresh Session ━━━
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) {
      logAuthError('refreshSession', error);
      return { session: null, error: getAuthError(error) };
    }

    return { session, error: null };
  } catch (error) {
    logAuthError('refreshSession', error);
    return { session: null, error: getAuthError(error) };
  }
};

// ━━━ Auth State Listener ━━━
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );

  return subscription;
};

export default {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithGoogleOAuth,
  sendPasswordResetEmail,
  updatePassword,
  resendVerificationEmail,
  signOut,
  getCurrentSession,
  getCurrentUser,
  refreshSession,
  onAuthStateChange,
};
