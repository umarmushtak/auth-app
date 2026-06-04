/**
 * useAuth Hook
 *
 * Central auth state management hook.
 * Handles session restoration, auth state listening, and all auth operations.
 * Provides loading states, user data, and auth methods to the UI layer.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle as googleSignInNative,
  signInWithGoogleOAuth as googleSignInWeb,
  sendPasswordResetEmail,
  updatePassword as updatePw,
  resendVerificationEmail,
  signOut as performSignOut,
  getCurrentSession,
  onAuthStateChange,
} from "../services/authService";

export const useAuth = () => {
  // ━━━ State ━━━
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // True until initial session check
  const [isAuthenticating, setIsAuthenticating] = useState(false); // True during auth operations
  const [authError, setAuthError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Ref to prevent state updates after unmount
  const mountedRef = useRef(true);

  // ━━━ Safe State Setter ━━━
  const safeSetState = useCallback((setter, value) => {
    if (mountedRef.current) {
      setter(value);
    }
  }, []);

  // ━━━ Clear Error ━━━
  const clearError = useCallback(() => {
    safeSetState(setAuthError, null);
  }, [safeSetState]);

  // ━━━ Session Restoration ━━━
  useEffect(() => {
    let subscription = null;

    const initializeAuth = async () => {
      try {
        // 1. Restore existing session
        const { session: existingSession } = await getCurrentSession();

        if (existingSession) {
          safeSetState(setSession, existingSession);
          safeSetState(setUser, existingSession.user);
        }
      } catch (error) {
        console.warn("[useAuth] Session restoration failed:", error);
      } finally {
        safeSetState(setIsLoading, false);
      }

      // 2. Listen for auth state changes
      subscription = onAuthStateChange((event, newSession) => {
        if (__DEV__) {
          console.log("[useAuth] Auth event:", event);
        }

        switch (event) {
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
            safeSetState(setSession, newSession);
            safeSetState(setUser, newSession?.user || null);
            safeSetState(setNeedsVerification, false);
            break;

          case "SIGNED_OUT":
            safeSetState(setSession, null);
            safeSetState(setUser, null);
            safeSetState(setNeedsVerification, false);
            safeSetState(setVerificationEmail, "");
            break;

          case "USER_UPDATED":
            safeSetState(setUser, newSession?.user || null);
            break;

          case "PASSWORD_RECOVERY":
            // Handle deep link from password reset email
            safeSetState(setSession, newSession);
            safeSetState(setUser, newSession?.user || null);
            break;

          default:
            break;
        }
      });
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [safeSetState]);

  // ━━━ Sign Up ━━━
  const signUp = useCallback(
    async (email, password) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const { data, error } = await signUpWithEmail(email, password);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        if (data.needsVerification) {
          safeSetState(setNeedsVerification, true);
          safeSetState(setVerificationEmail, email);
          return { success: true, needsVerification: true };
        }

        return { success: true, needsVerification: false };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState],
  );

  // ━━━ Sign In ━━━
  const signIn = useCallback(
    async (email, password) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const { data, error } = await signInWithEmail(email, password);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        return { success: true };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState],
  );

  // ━━━ Google Sign In (native — with idToken) ━━━
  const signInWithGoogleNative = useCallback(
    async (idToken) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const { data, error } = await googleSignInNative(idToken);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        return { success: true };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState],
  );

  // ━━━ Google Sign In (web — Supabase OAuth redirect) ━━━
  const signInWithGoogleWeb = useCallback(async () => {
    clearError();
    safeSetState(setIsAuthenticating, true);

    try {
      const { data, error } = await googleSignInWeb();

      if (error) {
        safeSetState(setAuthError, error);
        return { success: false, error };
      }

      // Web: browser will redirect to Google consent page
      return { success: true };
    } finally {
      safeSetState(setIsAuthenticating, false);
    }
  }, [clearError, safeSetState]);

  // ━━━ Forgot Password ━━━
  const forgotPassword = useCallback(
    async (email) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const { data, error } = await sendPasswordResetEmail(email);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        return { success: true, message: data.message };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState],
  );

  // ━━━ Update Password ━━━
  const updatePassword = useCallback(
    async (newPassword) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const { data, error } = await updatePw(newPassword);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        return { success: true };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState],
  );

  // ━━━ Resend Verification ━━━
  const resendVerification = useCallback(
    async (email) => {
      clearError();
      safeSetState(setIsAuthenticating, true);

      try {
        const targetEmail = email || verificationEmail;
        const { data, error } = await resendVerificationEmail(targetEmail);

        if (error) {
          safeSetState(setAuthError, error);
          return { success: false, error };
        }

        return { success: true, message: data.message };
      } finally {
        safeSetState(setIsAuthenticating, false);
      }
    },
    [clearError, safeSetState, verificationEmail],
  );

  // ━━━ Sign Out ━━━
  const signOut = useCallback(async () => {
    clearError();
    safeSetState(setIsAuthenticating, true);

    try {
      const { error } = await performSignOut();

      if (error) {
        safeSetState(setAuthError, error);
        return { success: false, error };
      }

      return { success: true };
    } finally {
      safeSetState(setIsAuthenticating, false);
    }
  }, [clearError, safeSetState]);

  // ━━━ Computed State ━━━
  const isAuthenticated = !!session && !!user;

  return {
    // State
    user,
    session,
    isLoading,
    isAuthenticating,
    isAuthenticated,
    authError,
    needsVerification,
    verificationEmail,

    // Actions
    signUp,
    signIn,
    signInWithGoogleNative,
    signInWithGoogleWeb,
    forgotPassword,
    updatePassword,
    resendVerification,
    signOut,
    clearError,
  };
};

export default useAuth;
