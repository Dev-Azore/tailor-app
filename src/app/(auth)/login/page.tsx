'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { loginWithPassword, loginWithMagicLink } from '../actions';

// Typed state shapes for useActionState compatibility with strict TS
type PasswordState =
  | Record<string, never>
  | { errors: Record<string, string[]> }
  | { error: string };

type MagicState =
  | Record<string, never>
  | { errors: Record<string, string[]> }
  | { error: string }
  | { success: true; message: string };

const initialPasswordState: PasswordState = {};
const initialMagicState: MagicState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordState, passwordAction, passwordPending] = useActionState<PasswordState, FormData>(
    loginWithPassword,
    initialPasswordState
  );
  const [magicState, magicAction, magicPending] = useActionState<MagicState, FormData>(
    loginWithMagicLink,
    initialMagicState
  );

  const isPending = passwordPending || magicPending;

  const passwordErrors = 'errors' in passwordState ? passwordState.errors : {};
  const passwordError = 'error' in passwordState ? passwordState.error : null;
  const magicErrors = 'errors' in magicState ? magicState.errors : {};
  const magicError = 'error' in magicState ? magicState.error : null;
  const magicSuccess = 'success' in magicState ? magicState : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
          <span className="text-2xl font-black text-white">T</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">TailorApp</h1>
        <p className="text-slate-400 text-sm">Measurement management for tailors</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        {/* Tabs */}
        <div className="flex rounded-lg bg-slate-800/60 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'password'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'magic'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Magic Link
          </button>
        </div>

        {mode === 'password' ? (
          <form action={passwordAction} className="space-y-4">
            {passwordError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {passwordError}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
                />
              </div>
              {passwordErrors.email && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.password[0]}</p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg text-sm hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {passwordPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>
        ) : (
          <form action={magicAction} className="space-y-4">
            {magicError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {magicError}
              </div>
            )}
            {magicSuccess && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">
                {magicSuccess.message}
              </div>
            )}

            <div>
              <label htmlFor="magic-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="magic-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
                />
              </div>
              {magicErrors.email && (
                <p className="mt-1 text-xs text-red-400">{magicErrors.email[0]}</p>
              )}
            </div>

            <button
              id="magic-link-submit"
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg text-sm hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {magicPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Magic Link
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
