import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Loader2, AlertCircle, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loginMode, setLoginMode] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear inputs whenever modal opens or mode changes
  useEffect(() => {
    if (authModalOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setShowPassword(false);
      setError(null);
    }
  }, [authModalOpen, isRegister, loginMode]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
    setError(null);
    setAuthModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        // Public registration strictly creates Student accounts
        await register(email, password, fullName, 'student');
      } else {
        await login(email, password);
      }
      setEmail('');
      setPassword('');
      setFullName('');
      setShowPassword(false);
    } catch (err) {
      setError(err.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {isRegister
              ? 'Student Registration'
              : loginMode === 'admin'
              ? 'Administrator Portal Sign In'
              : 'Student Sign In'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister
              ? 'Register a verified Student account to access academic assistance.'
              : loginMode === 'admin'
              ? 'Log in with administrator credentials to manage policy documents.'
              : 'Sign in to ask questions about university rules and guidelines.'}
          </p>
        </div>

        {/* Login Mode Toggle Tabs (Shown only on Login) */}
        {!isRegister && (
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginMode('student')}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                loginMode === 'student'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Student Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('admin')}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                loginMode === 'admin'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Login as Admin</span>
            </button>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {loginMode === 'admin' && !isRegister ? 'Administrator Email' : 'University Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  loginMode === 'admin' && !isRegister
                    ? 'admin@university.edu'
                    : 'student@university.edu'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Registration Role Note */}
          {isRegister && (
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Public registration creates a Student account. Administrator accounts are pre-configured.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 ${
              loginMode === 'admin' && !isRegister
                ? 'bg-indigo-700 hover:bg-indigo-800'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>
              {isRegister
                ? 'Register Student Account'
                : loginMode === 'admin'
                ? 'Sign In as Administrator'
                : 'Sign In as Student'}
            </span>
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New Student?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-blue-600 hover:underline"
              >
                Register Here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
