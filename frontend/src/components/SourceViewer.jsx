import React from 'react';
import { BookOpen, FileText, Tag, HelpCircle } from 'lucide-react';

export const SourceViewer = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 p-5 flex flex-col h-full shrink-0">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Policy References</h3>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-600 mb-1">No Sources Selected</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ask a question in the chat to view official document citations and matching policy clauses.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Policy References</h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {sources.length} Verified References
        </span>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-2xs"
          >
            {/* Title & Page Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-800 text-xs truncate">
                  {src.filename}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] shrink-0">
                Page {src.page_number}
              </span>
            </div>

            {/* Section Tag */}
            {src.section && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 w-fit max-w-full truncate">
                <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{src.section}</span>
              </div>
            )}

            {/* Excerpt Snippet */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
              "{src.excerpt}"
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
