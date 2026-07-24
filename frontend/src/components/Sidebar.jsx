import React from 'react';
import { LayoutDashboard, FileText, MessageSquare, ShieldCheck, HelpCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage, documentCount }) => {
  const { isAdmin } = useAuth();

  // Navigation Items Order:
  // - Administrator: 1. Admin Policy Documents, 2. Dashboard, 3. Academic Assistant
  // - Students/Guests: 1. Academic Assistant, 2. FAQ & Guidelines, 3. Active Policy Documents
  const adminNavItems = [
    { id: 'documents', label: 'Admin Policy Documents', icon: FileText, badge: documentCount },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Academic Assistant', icon: MessageSquare },
  ];

  const studentNavItems = [
    { id: 'chat', label: 'Academic Assistant', icon: MessageSquare },
    { id: 'faq', label: 'FAQ & Guidelines', icon: HelpCircle },
    { id: 'policydocs', label: 'Active Policy Documents', icon: BookOpen, badge: documentCount },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header with Custom Golden Graduation Cap Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-slate-800 p-1 flex items-center justify-center border border-slate-700 shadow-sm shrink-0">
          <img src="/logo.png" alt="University Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">University Portal</h1>
          <p className="text-xs text-slate-400">Academic Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {isAdmin ? 'Admin Menu' : 'Student Navigation'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-blue-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Official Portal</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isAdmin
            ? 'Administrator Mode: Full document upload & policy access active.'
            : 'Verified official regulations, fee schedules, and hostel policies.'}
        </p>
      </div>
    </aside>
  );
};
