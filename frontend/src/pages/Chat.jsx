import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Trash2, Sparkles, Lock } from 'lucide-react';
import { MessageBubble } from '../components/MessageBubble';
import { samplePrompts } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const ChatPage = ({
  messages,
  loading,
  activeSources,
  onSendMessage,
  onSelectSources,
  onClearChat
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null);
  const { isAuthenticated, setAuthModalOpen, user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleChipClick = (promptText) => {
    if (loading) return;
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    onSendMessage(promptText);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      {/* Full Width Chat Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Chat Control Toolbar */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              {user?.role === 'admin'
                ? 'Administrator Academic Assistant'
                : 'Academic Query Assistant'}
            </h3>
          </div>
          <button
            onClick={onClearChat}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-slate-200 transition-colors font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onSelectSources={onSelectSources} />
          ))}

          {/* Typing / Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-4xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-2xs flex items-center gap-3 text-slate-600 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Searching official university regulations & generating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Chips */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-t border-slate-200 flex items-center justify-center gap-2 overflow-x-auto text-xs shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">Try asking:</span>
          {samplePrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(prompt)}
              disabled={loading}
              className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full border border-slate-200 hover:border-blue-300 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-5 bg-white border-t border-slate-200 shrink-0">
          {!isAuthenticated && (
            <div className="max-w-4xl mx-auto mb-3 text-center text-xs text-amber-800 bg-amber-50 border border-amber-200 py-2 px-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-2xs">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Authentication required: Please sign in or register to submit questions.</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isAuthenticated
                  ? "Ask a question about university rules, hostel policies, exam guidelines, or fee structure..."
                  : "Sign in to ask questions about university rules..."
              }
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isAuthenticated ? 'Ask' : 'Sign In to Ask'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
