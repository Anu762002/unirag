import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const UploadZone = ({ onUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const pdfs = files.filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      setUploadStatus({ type: 'error', message: 'Please select valid PDF documents.' });
      return;
    }
    setSelectedFiles(pdfs);
    setUploadStatus(null);
  };

  const triggerUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      setUploadStatus(null);
      await onUpload(selectedFiles);
      setUploadStatus({ type: 'success', message: `Successfully uploaded ${selectedFiles.length} file(s)!` });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadStatus({ type: 'error', message: err.detail || 'Upload failed.' });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-1">Upload University Documents</h3>
      <p className="text-xs text-slate-500 mb-4">
        Upload PDF files (Rules, Fee Schedules, Hostel Policies, Exam Guidelines). Text will be extracted, cleaned, hierarchically chunked, and embedded into ChromaDB.
      </p>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3">
          <Upload className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Click to upload or drag & drop PDFs here
        </p>
        <p className="text-xs text-slate-400 mt-1">Supports single or multiple PDF documents</p>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <p className="text-xs font-semibold text-slate-600">Files Ready for Processing:</p>
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium truncate flex-1">{file.name}</span>
              <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          ))}

          <button
            onClick={triggerUpload}
            disabled={uploading}
            className="w-full mt-3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text, Hierarchical Chunking & Embedding...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Process & Index {selectedFiles.length} Document(s)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Feedback Alerts */}
      {uploadStatus && (
        <div
          className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
};
