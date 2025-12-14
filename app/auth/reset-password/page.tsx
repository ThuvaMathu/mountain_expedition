"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Check, X } from "lucide-react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import AppLogo from "@/components/ui/app-logo";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  // Password validation criteria
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasTwoDigits: (password.match(/\d/g) || []).length >= 2,
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError("Invalid or missing password reset link.");
        setIsVerifying(false);
        return;
      }

      if (!isFirebaseConfigured || !auth) {
        setError("Firebase is not configured. Please contact support.");
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the password reset code and get the user's email
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setIsVerifying(false);
      } catch (error: any) {
        const errorMessage = getFirebaseErrorMessage(error);
        setError(errorMessage);
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      setIsLoading(false);
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!oobCode) {
      setError("Invalid password reset link.");
      setIsLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setError("Firebase is not configured. Please contact support.");
      setIsLoading(false);
      return;
    }

    try {
      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <AppLogo isWithText={false} size="medium" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Verifying reset link...
            </h2>
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <AppLogo isWithText={false} size="medium" />
            </div>
            <div className="mt-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been updated. Redirecting to sign in...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !email) {
    return (
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <AppLogo isWithText={false} size="medium" />
            </div>
            <div className="mt-6 flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Invalid Reset Link
            </h2>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-500"
              >
                Request a new password reset link
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <AppLogo isWithText={false} size="medium" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Set new password
          </h2>
          {email && (
            <p className="mt-2 text-sm text-gray-600">
              Setting new password for: <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-700">Password must contain:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordValidation.minLength ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasUpperCase ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasSymbol ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-600'}`}>
                        At least one special character (!@#$%^&*...)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasTwoDigits ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasTwoDigits ? 'text-green-600' : 'text-gray-600'}`}>
                        At least two numbers (0-9)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <div className="mt-2">
                  {doPasswordsMatch ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-500">Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting password...
                </div>
              ) : (
                "Reset password"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-teal-600 hover:text-teal-500"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
