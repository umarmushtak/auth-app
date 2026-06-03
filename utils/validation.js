/**
 * Real-time Form Validation Utilities
 * 
 * Provides granular validation with inline error messages.
 * All validators return { isValid, error } for consistent consumption.
 */

// ━━━ Email Validation ━━━
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const validateEmail = (email) => {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required.' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true, error: null };
};

// ━━━ Password Strength Rules ━━━
const PASSWORD_RULES = [
  {
    id: 'minLength',
    test: (pw) => pw.length >= 8,
    message: 'At least 8 characters',
  },
  {
    id: 'uppercase',
    test: (pw) => /[A-Z]/.test(pw),
    message: 'One uppercase letter',
  },
  {
    id: 'lowercase',
    test: (pw) => /[a-z]/.test(pw),
    message: 'One lowercase letter',
  },
  {
    id: 'number',
    test: (pw) => /[0-9]/.test(pw),
    message: 'One number',
  },
  {
    id: 'special',
    test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
    message: 'One special character (!@#$%...)',
  },
];

export const validatePassword = (password) => {
  const pw = password || '';

  if (!pw) {
    return {
      isValid: false,
      error: 'Password is required.',
      rules: PASSWORD_RULES.map((r) => ({ ...r, passed: false })),
      strength: 0,
    };
  }

  const rules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(pw),
  }));

  const passedCount = rules.filter((r) => r.passed).length;
  const strength = passedCount / PASSWORD_RULES.length;
  const allPassed = passedCount === PASSWORD_RULES.length;

  return {
    isValid: allPassed,
    error: allPassed ? null : 'Password does not meet all requirements.',
    rules,
    strength,
  };
};

// ━━━ Confirm Password ━━━
export const validateConfirmPassword = (password, confirmPassword) => {
  const confirm = confirmPassword || '';

  if (!confirm) {
    return { isValid: false, error: 'Please confirm your password.' };
  }

  if (confirm !== password) {
    return { isValid: false, error: 'Passwords do not match.' };
  }

  return { isValid: true, error: null };
};

// ━━━ Sanitization ━━━
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent injection
    .slice(0, 500);       // Limit length to prevent abuse
};

export const sanitizeEmail = (email) => {
  return sanitizeInput(email).toLowerCase();
};

// ━━━ Form-level Validation ━━━
export const validateSignInForm = (email, password) => {
  const emailResult = validateEmail(email);
  const passwordValid = (password || '').length > 0;

  return {
    isValid: emailResult.isValid && passwordValid,
    errors: {
      email: emailResult.error,
      password: passwordValid ? null : 'Password is required.',
    },
  };
};

export const validateSignUpForm = (email, password, confirmPassword) => {
  const emailResult = validateEmail(email);
  const passwordResult = validatePassword(password);
  const confirmResult = validateConfirmPassword(password, confirmPassword);

  return {
    isValid: emailResult.isValid && passwordResult.isValid && confirmResult.isValid,
    errors: {
      email: emailResult.error,
      password: passwordResult.error,
      confirmPassword: confirmResult.error,
    },
    passwordRules: passwordResult.rules,
    passwordStrength: passwordResult.strength,
  };
};

export const validateForgotPasswordForm = (email) => {
  const emailResult = validateEmail(email);

  return {
    isValid: emailResult.isValid,
    errors: {
      email: emailResult.error,
    },
  };
};

export const validateResetPasswordForm = (password, confirmPassword) => {
  const passwordResult = validatePassword(password);
  const confirmResult = validateConfirmPassword(password, confirmPassword);

  return {
    isValid: passwordResult.isValid && confirmResult.isValid,
    errors: {
      password: passwordResult.error,
      confirmPassword: confirmResult.error,
    },
    passwordRules: passwordResult.rules,
    passwordStrength: passwordResult.strength,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  sanitizeInput,
  sanitizeEmail,
  validateSignInForm,
  validateSignUpForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
};
