import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.detail || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFiles = async (files) => {
    setUploading(true);
    setError(null);
    try {
      const res = await apiService.uploadDocuments(files);
      await fetchDocuments();
      return res;
    } catch (err) {
      setError(err.detail || 'Failed to upload files.');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (docId) => {
    setError(null);
    try {
      await apiService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.doc_id !== docId));
    } catch (err) {
      setError(err.detail || 'Failed to delete document.');
      throw err;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    uploading,
    error,
    fetchDocuments,
    uploadFiles,
    deleteDoc,
  };
};
