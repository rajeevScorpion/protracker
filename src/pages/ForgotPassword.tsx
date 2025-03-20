import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { sendPasswordResetEmail } from '../lib/auth';
import OtpInput from '../components/auth/OtpInput';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await sendPasswordResetEmail(email);
      if (result.error) {
        setError(result.error);
      } else {
        setStep('otp');
      }
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendResetEmail} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Email address"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>

            <p className="text-center text-sm">
              <Link to="/login" className="text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-600 text-center">
              We've sent a verification code to your email
            </p>
            <OtpInput
              value={otp}
              onChange={setOtp}
            />
            <button
              onClick={() => setStep('password')}
              disabled={otp.length !== 6}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              Verify Code
            </button>
          </div>
        )}

        {step === 'password' && (
          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="newPassword" className="sr-only">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="New password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
