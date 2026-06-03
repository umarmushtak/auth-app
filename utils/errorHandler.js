/**
 * Centralized Error Handler
 * 
 * Maps Supabase/network errors to human-friendly messages.
 * Prevents raw technical errors from reaching the UI.
 */

// ━━━ Error Message Map ━━━
const ERROR_MAP = {
  // Supabase Auth Errors
  'Invalid login credentials': 'Email or password is incorrect.',
  'invalid_credentials': 'Email or password is incorrect.',
  'Email not confirmed': 'Please verify your email before signing in.',
  'User already registered': 'This email already has an account. Try signing in.',
  'user_already_exists': 'This email already has an account. Try signing in.',
  'Password should be at least 6 characters': 'Password must be at least 8 characters long.',
  'Signup requires a valid password': 'Please enter a valid password.',
  'Unable to validate email address: invalid format': 'Please enter a valid email address.',
  'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes.',
  'For security purposes, you can only request this once every 60 seconds': 
    'Please wait 60 seconds before requesting another email.',
  'Token has expired or is invalid': 'This link has expired. Please request a new one.',
  'New password should be different from the old password': 
    'New password must be different from your current password.',
  'Auth session missing': 'Your session has expired. Please sign in again.',
  'refresh_token_not_found': 'Your session has expired. Please sign in again.',

  // Network Errors
  'Network request failed': 'Check your internet connection and try again.',
  'Failed to fetch': 'Check your internet connection and try again.',
  'TypeError: Network request failed': 'Check your internet connection and try again.',
  'NETWORK_ERROR': 'Check your internet connection and try again.',

  // Google OAuth Errors
  'SIGN_IN_CANCELLED': 'Google sign-in was cancelled.',
  'IN_PROGRESS': 'Sign-in is already in progress.',
  'PLAY_SERVICES_NOT_AVAILABLE': 'Google Play Services is not available on this device.',

  // Rate Limiting
  'rate_limit': 'Too many requests. Please try again in a moment.',

  // Generic
  'unexpected_failure': 'Something went wrong. Please try again.',
};

// ━━━ Error Normalization ━━━
const normalizeErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // String errors
  if (typeof error === 'string') return error;

  // Supabase error shape: { message, status, code }
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.msg) return error.msg;

  // Fallback
  return JSON.stringify(error);
};

// ━━━ Main Error Handler ━━━
export const getAuthError = (error) => {
  const rawMessage = normalizeErrorMessage(error);

  // Check exact matches first
  if (ERROR_MAP[rawMessage]) {
    return ERROR_MAP[rawMessage];
  }

  // Check if error code matches
  if (error?.code && ERROR_MAP[error.code]) {
    return ERROR_MAP[error.code];
  }

  // Partial match — iterate through keys
  for (const [key, friendlyMessage] of Object.entries(ERROR_MAP)) {
    if (rawMessage.toLowerCase().includes(key.toLowerCase())) {
      return friendlyMessage;
    }
  }

  // Network errors detection
  if (
    rawMessage.includes('network') ||
    rawMessage.includes('fetch') ||
    rawMessage.includes('ECONNREFUSED') ||
    rawMessage.includes('timeout')
  ) {
    return 'Check your internet connection and try again.';
  }

  // Fallback — still human-friendly, never expose raw error
  console.warn('[AuthErrorHandler] Unmapped error:', rawMessage);
  return 'Something went wrong. Please try again.';
};

// ━━━ Error Logger (for debugging, never shown to users) ━━━
export const logAuthError = (context, error) => {
  if (__DEV__) {
    console.error(`[Auth:${context}]`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      raw: error,
    });
  }
};

export default { getAuthError, logAuthError };
