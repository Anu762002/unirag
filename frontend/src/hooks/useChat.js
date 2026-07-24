import { useState } from 'react';
import { apiService } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: 'Hello! I am your AI Academic Assistant. Ask me anything about university regulations, fee structures, hostel rules, exam guidelines, or scholarships!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = async (questionText) => {
    if (!questionText.trim() || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.sendChat(questionText);

      const assistantMsg = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (response.sources && response.sources.length > 0) {
        setActiveSources(response.sources);
      }
    } catch (err) {
      const errorMsg = err.detail || 'An error occurred while connecting to the assistant.';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Error**: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectMessageSources = (sources) => {
    setActiveSources(sources || []);
  };

  const clearChat = () => {
    setMessages([]);
    setActiveSources([]);
  };

  return {
    messages,
    loading,
    error,
    activeSources,
    sendMessage,
    selectMessageSources,
    clearChat
  };
};
