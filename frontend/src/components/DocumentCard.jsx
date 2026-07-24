import React, { useState } from 'react';
import { FileText, Trash2, Calendar, Layers, HardDrive, Loader2, Eye, Download } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8005';

export const DocumentCard = ({ doc, onDelete, canDelete = true }) => {
  const [deleting, setDeleting] = useState(false);

  const viewUrl = `${API_BASE_URL}/documents/view/id/${doc.doc_id}`;
  const downloadUrl = `${API_BASE_URL}/documents/download/id/${doc.doc_id}`;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove '${doc.filename}' from the official university catalog?`)) {
      setDeleting(true);
      try {
        await onDelete(doc.doc_id);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to view PDF in browser"
            className="font-bold text-slate-800 text-sm hover:text-blue-600 truncate block hover:underline"
          >
            {doc.filename}
          </a>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-400" />
              {formatBytes(doc.file_size)}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              {doc.page_count} Page(s) ({doc.chunk_count} Sections)
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {doc.upload_date}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View PDF Document in New Tab"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors border border-blue-200"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View PDF</span>
        </a>

        <a
          href={downloadUrl}
          download={doc.filename}
          title="Download PDF Document"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </a>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Document"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
