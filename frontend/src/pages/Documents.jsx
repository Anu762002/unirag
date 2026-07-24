import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { DocumentCard } from '../components/DocumentCard';
import { FileText, Loader2, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DocumentsPage = ({ documents, loading, uploading, onUpload, onDelete }) => {
  const { isAdmin, isAuthenticated, setAuthModalOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Policy Documents & Upload Manager</h2>
          </div>
          <p className="text-xs text-slate-500">
            Upload new university regulation PDFs, inspect active document indexes, and manage published policy files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            {documents.length} Published Documents
          </span>
        </div>
      </div>

      {/* Upload Zone for Administrators */}
      {isAdmin ? (
        <UploadZone onUpload={onUpload} uploading={uploading} />
      ) : (
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold">Administrator Document Upload</p>
              <p className="text-blue-700/80 mt-0.5">
                Students can browse and query all active university policy documents. To upload or manage official PDFs, sign in with an Administrator account.
              </p>
            </div>
          </div>
          {!isAuthenticated && (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all shrink-0"
            >
              Sign In as Admin
            </button>
          )}
        </div>
      )}

      {/* Published Policy Documents Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Published Policy Documents ({filteredDocs.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search published documents..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-xs font-semibold">Loading published documents...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Published Documents Found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Please upload PDF files above to index new university regulations into the system.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.doc_id} doc={doc} onDelete={onDelete} canDelete={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
