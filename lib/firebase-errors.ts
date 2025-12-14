/**
 * Firebase error code to user-friendly message mapping
 * Provides clear, actionable error messages for authentication errors
 */

export interface FirebaseErrorResponse {
  message: string;
  code: string;
}

/**
 * Converts Firebase auth error codes to user-friendly messages
 */
export function getFirebaseErrorMessage(error: any): string {
  const errorCode = error?.code || '';

  switch (errorCode) {
    // Login/Sign-in errors
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';

    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';

    case 'auth/invalid-email':
      return 'Invalid email address. Please enter a valid email.';

    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';

    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';

    // Registration errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';

    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';

    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';

    // Password reset errors
    case 'auth/expired-action-code':
      return 'This password reset link has expired. Please request a new one.';

    case 'auth/invalid-action-code':
      return 'This password reset link is invalid or has already been used. Please request a new one.';

    case 'auth/user-not-found':
      return 'No account found with this email address.';

    // Google sign-in errors
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';

    case 'auth/popup-blocked':
      return 'Pop-up blocked by browser. Please allow pop-ups and try again.';

    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled. Only one sign-in request allowed at a time.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in method. Please use your original sign-in method.';

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';

    case 'auth/timeout':
      return 'Request timed out. Please try again.';

    // General errors
    case 'auth/requires-recent-login':
      return 'For security reasons, please sign out and sign in again to perform this action.';

    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';

    case 'auth/invalid-verification-id':
      return 'Invalid verification ID. Please restart the verification process.';

    case 'auth/missing-verification-code':
      return 'Please enter the verification code.';

    case 'auth/missing-verification-id':
      return 'Verification ID is missing. Please restart the verification process.';

    // Default fallback
    default:
      // If we have a custom message from Firebase, use it
      if (error?.message) {
        // Clean up Firebase error messages (remove "Firebase: " prefix)
        const cleanMessage = error.message.replace(/^Firebase:\s*/i, '');
        return cleanMessage || 'An error occurred. Please try again.';
      }
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Checks if an error is a Firebase auth error
 */
export function isFirebaseError(error: any): boolean {
  return error?.code?.startsWith('auth/') || false;
}

/**
 * Gets a structured error response with code and message
 */
export function getFirebaseError(error: any): FirebaseErrorResponse {
  return {
    code: error?.code || 'unknown',
    message: getFirebaseErrorMessage(error),
  };
}