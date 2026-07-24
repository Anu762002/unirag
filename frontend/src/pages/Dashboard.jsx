import React from 'react';
import { FileText, Layers, MessageSquare, Upload, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { samplePrompts } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const Dashboard = ({ documents, onNavigate, onSendQuickQuestion }) => {
  const { isAuthenticated, isAdmin, setAuthModalOpen } = useAuth();
  const totalPages = documents.reduce((sum, d) => sum + (d.page_count || 0), 0);
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0);

  const handleQuickQuestionClick = (promptText) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    onSendQuickQuestion(promptText);
  };

  const handleChatButtonClick = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    onNavigate('chat');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs border border-white/20 text-blue-100 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official University Knowledge Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            University Academic Assistant
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed mb-6">
            Search official university rules, academic regulations, fee structures, hostel living policies, and examination guidelines with verified document source citations.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleChatButtonClick}
              className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>{isAuthenticated ? 'Ask Academic Question' : 'Sign In to Ask Questions'}</span>
            </button>
            <button
              onClick={() => onNavigate('documents')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20 flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Browse Policy Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Official Documents"
          value={documents.length}
          subtitle={`${totalPages} cataloged PDF pages`}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Cataloged Sections"
          value={totalChunks}
          subtitle="Indexed policy clauses & rules"
          icon={Layers}
          color="indigo"
        />
        <StatsCard
          title="Knowledge Status"
          value="Verified Active"
          subtitle="Updated regulation archive"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Quick Academic Queries & Active Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sample Questions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
            <span className="text-xs text-blue-600 font-semibold">Click to ask</span>
          </div>
          <div className="space-y-2.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestionClick(prompt)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 font-medium flex items-center justify-between group transition-all"
              >
                <span>"{prompt}"</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Knowledge Base */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Active Policy Documents</h3>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No policy documents available</p>
              <p className="text-[11px]">Upload PDFs to index rules, hostel policies, and fee structures.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 4).map((doc) => (
                <div key={doc.doc_id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-800">{doc.filename}</p>
                      <p className="text-slate-400 text-[11px]">{doc.page_count} page(s) • {doc.chunk_count} section(s)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
