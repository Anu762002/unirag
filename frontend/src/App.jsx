import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { DocumentsPage } from './pages/Documents';
import { ChatPage } from './pages/Chat';
import { FAQPage } from './pages/FAQPage';
import { ActivePolicyDocs } from './pages/ActivePolicyDocs';
import { useDocuments } from './hooks/useDocuments';
import { useChat } from './hooks/useChat';

function MainAppContent() {
  const { isAdmin } = useAuth();
  const [activePage, setActivePage] = useState(isAdmin ? 'documents' : 'chat');

  // Automatically update page route when role changes
  useEffect(() => {
    if (isAdmin) {
      if (activePage === 'chat' || activePage === 'faq' || activePage === 'policydocs') {
        setActivePage('documents');
      }
    } else {
      if (activePage === 'dashboard' || activePage === 'documents') {
        setActivePage('chat');
      }
    }
  }, [isAdmin]);

  const {
    documents,
    loading: docsLoading,
    uploading,
    uploadFiles,
    deleteDoc,
  } = useDocuments();

  const {
    messages,
    loading: chatLoading,
    activeSources,
    sendMessage,
    selectMessageSources,
    clearChat,
  } = useChat();

  const handleSendQuickQuestion = (questionText) => {
    setActivePage('chat');
    sendMessage(questionText);
  };

  const pageTitles = {
    documents: 'Admin Policy Documents & Upload Manager',
    dashboard: 'Administrator Knowledge Dashboard',
    chat: 'Academic Assistant Chat',
    faq: 'Frequently Asked Questions & Guidelines',
    policydocs: 'Active University Policy Documents',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        documentCount={documents.length}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header title={pageTitles[activePage] || 'Academic Assistant'} />

        <main className="flex-1 overflow-y-auto min-w-0">
          {activePage === 'documents' && isAdmin && (
            <DocumentsPage
              documents={documents}
              loading={docsLoading}
              uploading={uploading}
              onUpload={uploadFiles}
              onDelete={deleteDoc}
            />
          )}

          {activePage === 'dashboard' && isAdmin && (
            <Dashboard
              documents={documents}
              onNavigate={setActivePage}
              onSendQuickQuestion={handleSendQuickQuestion}
            />
          )}

          {activePage === 'chat' && (
            <ChatPage
              messages={messages}
              loading={chatLoading}
              activeSources={activeSources}
              onSendMessage={sendMessage}
              onSelectSources={selectMessageSources}
              onClearChat={clearChat}
            />
          )}

          {activePage === 'faq' && (
            <FAQPage onAskQuestion={handleSendQuickQuestion} />
          )}

          {activePage === 'policydocs' && (
            <ActivePolicyDocs documents={documents} loading={docsLoading} />
          )}
        </main>

        <AuthModal />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
