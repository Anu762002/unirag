import React from 'react';
import { User, LogOut, LogIn, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ title }) => {
  const { user, isAuthenticated, setAuthModalOpen, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 leading-tight">{user.full_name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                {user.role === 'admin' ? (
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    Administrator
                  </span>
                ) : (
                  <span className="text-blue-600 font-bold flex items-center gap-0.5">
                    <GraduationCap className="w-3 h-3 text-blue-600" />
                    Student
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};
