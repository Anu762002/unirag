import React from 'react';
import { User, Bot, FileText, ExternalLink } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8005';

export const MessageBubble = ({ message, onSelectSources }) => {
  const isUser = message.sender === 'user';

  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');

    return (
      <div className="space-y-1.5">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <div key={lineIdx} className="h-1" />;

          const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
          const cleanLine = isBullet ? line.trim().replace(/^[\*\-]\s+/, '') : line;

          // Parse **bold** syntax
          const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className={isUser ? 'font-bold text-white' : 'font-bold text-slate-900'}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-2 my-1">
                <span className={isUser ? 'text-white font-bold shrink-0' : 'text-blue-600 font-bold shrink-0'}>•</span>
                <span className="flex-1">{formattedLine}</span>
              </div>
            );
          }

          return <p key={lineIdx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
      {/* Bot Icon */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className="space-y-2 max-w-3xl">
        {/* Main Message Box */}
        <div
          className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none font-medium'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-normal'
          }`}
        >
          {renderFormattedText(message.text)}
        </div>

        {/* Source Citations Badges (For Assistant Messages) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              Retrieved Sources:
            </span>
            {message.sources.map((src, idx) => {
              const fileViewUrl = `${API_BASE_URL}/documents/view/file/${encodeURIComponent(src.filename)}`;

              return (
                <a
                  key={idx}
                  href={fileViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Click to view/download PDF source: ${src.filename} (Page ${src.page_number})`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 text-[11px] font-semibold transition-all group cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3 h-3 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>{src.filename}</span>
                  <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded font-bold">
                    p.{src.page_number}
                  </span>
                  <ExternalLink className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </a>
              );
            })}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
