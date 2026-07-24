import React, { useState } from 'react';
import { FileText, Search, Calendar, Layers, HardDrive, ShieldCheck, Eye, Download } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8005';

export const ActivePolicyDocs = ({ documents, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Policy Documents</h2>
          </div>
          <p className="text-xs text-slate-500">
            Browse, view, and download official university policy manuals, academic handbooks, and Hostel & Exam guidelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Document Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const viewUrl = `${API_BASE_URL}/documents/view/id/${doc.doc_id}`;
          const downloadUrl = `${API_BASE_URL}/documents/download/id/${doc.doc_id}`;

          return (
            <div
              key={doc.doc_id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 hover:underline block"
                    title="Click to view PDF document in browser"
                  >
                    {doc.filename}
                  </a>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified Active
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {doc.page_count} Page(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      {formatBytes(doc.file_size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Uploaded: {doc.upload_date}</span>
                  </div>
                </div>

                {/* View & Download Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors border border-blue-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </a>
                  <a
                    href={downloadUrl}
                    download={doc.filename}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
