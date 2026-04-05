import { useState, useCallback } from 'react';
import { getUserDocuments, saveDocument, deleteDocument as deleteDocFromStorage } from '../utils/storage';
import { createDocument } from '../utils/charFactory';

export function useDocuments(username) {
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);

  const activeDoc = openDocs.find(d => d.id === activeDocId) || null;

  // Create a new empty document
  const newDocument = useCallback((name = 'Untitled') => {
    const doc = createDocument(username, name);
    setOpenDocs(prev => [...prev, doc]);
    setActiveDocId(doc.id);
    return doc;
  }, [username]);

  // Open an existing document from storage
  const openDocument = useCallback((doc) => {
    // Check if already open
    const alreadyOpen = openDocs.find(d => d.id === doc.id);
    if (alreadyOpen) {
      setActiveDocId(doc.id);
      return;
    }
    setOpenDocs(prev => [...prev, { ...doc }]);
    setActiveDocId(doc.id);
  }, [openDocs]);

  // Get all saved documents for this user
  const getSavedDocuments = useCallback(() => {
    return getUserDocuments(username);
  }, [username]);

  // Save the active document
  const save = useCallback((doc = null) => {
    const docToSave = doc || activeDoc;
    if (!docToSave) return;

    const updated = { ...docToSave, savedAt: Date.now(), updatedAt: Date.now() };
    saveDocument(username, updated);

    setOpenDocs(prev =>
      prev.map(d => d.id === updated.id ? updated : d)
    );
  }, [activeDoc, username]);

  // Save As — create a copy with a new name
  const saveAs = useCallback((newName) => {
    if (!activeDoc) return;

    const newDoc = createDocument(username, newName);
    newDoc.chars = [...activeDoc.chars];
    newDoc.savedAt = Date.now();

    saveDocument(username, newDoc);

    setOpenDocs(prev => prev.map(d =>
      d.id === activeDoc.id ? newDoc : d
    ));
    setActiveDocId(newDoc.id);
  }, [activeDoc, username]);

  // Close a document
  const closeDocument = useCallback((docId) => {
    setOpenDocs(prev => {
      const filtered = prev.filter(d => d.id !== docId);
      // If we closed the active doc, switch to the last remaining one
      if (docId === activeDocId) {
        const newActive = filtered.length > 0 ? filtered[filtered.length - 1].id : null;
        setActiveDocId(newActive);
      }
      return filtered;
    });
  }, [activeDocId]);

  // Update the chars array of the active document
  const updateActiveDocChars = useCallback((newChars) => {
    setOpenDocs(prev =>
      prev.map(d =>
        d.id === activeDocId
          ? { ...d, chars: newChars, updatedAt: Date.now() }
          : d
      )
    );
  }, [activeDocId]);

  // Rename a document
  const renameDocument = useCallback((docId, newName) => {
    setOpenDocs(prev =>
      prev.map(d =>
        d.id === docId ? { ...d, name: newName, updatedAt: Date.now() } : d
      )
    );
  }, []);

  // Check if document has unsaved changes
  const hasUnsavedChanges = useCallback((docId) => {
    const doc = openDocs.find(d => d.id === docId);
    if (!doc) return false;
    if (!doc.savedAt) return doc.chars.length > 0; // never saved, has content
    return doc.updatedAt > doc.savedAt;
  }, [openDocs]);

  // Delete document from storage
  const deleteDocumentPermanently = useCallback((docId) => {
    deleteDocFromStorage(username, docId);
    closeDocument(docId);
  }, [username, closeDocument]);

  return {
    openDocs,
    activeDoc,
    activeDocId,
    setActiveDocId,
    newDocument,
    openDocument,
    getSavedDocuments,
    save,
    saveAs,
    closeDocument,
    updateActiveDocChars,
    renameDocument,
    hasUnsavedChanges,
    deleteDocumentPermanently,
  };
}
