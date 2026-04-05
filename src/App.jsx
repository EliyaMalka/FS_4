import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDocuments } from './hooks/useDocuments';
import { useEditorState } from './hooks/useEditorState';

import LoginScreen from './components/Auth/LoginScreen';
import AppLayout from './components/Layout/AppLayout';
import DocumentGrid from './components/DocumentGrid/DocumentGrid';
import ActiveEditor from './components/Editor/ActiveEditor';
import FileToolbar from './components/Toolbar/FileToolbar';
import StyleToolbar from './components/Toolbar/StyleToolbar';
import EditToolbar from './components/Toolbar/EditToolbar';
import VirtualKeyboard from './components/Keyboard/VirtualKeyboard';
import SavePrompt from './components/Modals/SavePrompt';
import OpenFileDialog from './components/Modals/OpenFileDialog';
import SaveAsDialog from './components/Modals/SaveAsDialog';
import FindReplaceDialog from './components/Modals/FindReplaceDialog';

import './App.css';

export default function App() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  // --- Modal state ---
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [pendingCloseDocId, setPendingCloseDocId] = useState(null);

  // --- Documents ---
  const docManager = useDocuments(user);
  const {
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
    hasUnsavedChanges,
  } = docManager;

  // --- Editor State ---
  const editorState = useEditorState(activeDoc, updateActiveDocChars);

  // --- File Toolbar Handlers ---
  const handleNew = useCallback(() => {
    newDocument();
  }, [newDocument]);

  const handleOpen = useCallback(() => {
    setShowOpenDialog(true);
  }, []);

  const handleSave = useCallback(() => {
    if (activeDoc) {
      save();
    }
  }, [activeDoc, save]);

  const handleSaveAs = useCallback(() => {
    if (activeDoc) {
      setShowSaveAsDialog(true);
    }
  }, [activeDoc]);

  const handleClose = useCallback((docId = null) => {
    const id = docId || activeDocId;
    if (!id) return;

    if (hasUnsavedChanges(id)) {
      setPendingCloseDocId(id);
    } else {
      closeDocument(id);
    }
  }, [activeDocId, hasUnsavedChanges, closeDocument]);

  // --- Save Prompt Handlers ---
  const handleSaveAndClose = useCallback(() => {
    if (pendingCloseDocId) {
      // Find the doc to save
      const doc = openDocs.find(d => d.id === pendingCloseDocId);
      if (doc) save(doc);
      closeDocument(pendingCloseDocId);
      setPendingCloseDocId(null);
    }
  }, [pendingCloseDocId, openDocs, save, closeDocument]);

  const handleDiscardAndClose = useCallback(() => {
    if (pendingCloseDocId) {
      closeDocument(pendingCloseDocId);
      setPendingCloseDocId(null);
    }
  }, [pendingCloseDocId, closeDocument]);

  const handleCancelClose = useCallback(() => {
    setPendingCloseDocId(null);
  }, []);

  // --- Open Dialog Handler ---
  const handleOpenSelect = useCallback((doc) => {
    openDocument(doc);
    setShowOpenDialog(false);
  }, [openDocument]);

  // --- Save As Handler ---
  const handleSaveAsConfirm = useCallback((newName) => {
    saveAs(newName);
    setShowSaveAsDialog(false);
  }, [saveAs]);

  // --- Find/Replace Handlers ---
  const handleFind = useCallback((str) => {
    return editorState.findInText(str);
  }, [editorState]);

  const handleReplace = useCallback((findStr, replaceStr) => {
    editorState.replaceInText(findStr, replaceStr);
  }, [editorState]);

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        Loading...
      </div>
    );
  }

  // --- Auth Gate ---
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  // --- Pending close doc name ---
  const pendingCloseDoc = pendingCloseDocId
    ? openDocs.find(d => d.id === pendingCloseDocId)
    : null;

  return (
    <>
      <AppLayout
        user={user}
        onLogout={logout}
        hasOpenDocs={openDocs.length > 0}
        onNewDocument={handleNew}
        showKeyboard={editorState.showKeyboard}
        toolbar={
          <FileToolbar
            onNew={handleNew}
            onOpen={handleOpen}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onClose={() => handleClose()}
            hasActiveDoc={!!activeDoc}
          />
        }
        documentGrid={
          <DocumentGrid
            docs={openDocs}
            activeDocId={activeDocId}
            onSelect={setActiveDocId}
            onClose={handleClose}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        }
        editor={
          activeDoc ? (
            <>
              <StyleToolbar editorState={editorState} />
              <EditToolbar
                editorState={editorState}
                onFindReplace={() => setShowFindReplace(true)}
              />
              <ActiveEditor
                editorState={editorState}
                showKeyboard={editorState.showKeyboard}
              />
            </>
          ) : (
            <div className="editor-no-doc" style={{ padding: '24px', color: 'var(--text-muted)' }}>
              📄 Select a document from above to start editing
            </div>
          )
        }
        keyboard={
          activeDoc ? (
            <VirtualKeyboard editorState={editorState} />
          ) : null
        }
      />

      {/* Modals */}
      {pendingCloseDoc && (
        <SavePrompt
          docName={pendingCloseDoc.name}
          onSave={handleSaveAndClose}
          onDiscard={handleDiscardAndClose}
          onCancel={handleCancelClose}
        />
      )}

      {showOpenDialog && (
        <OpenFileDialog
          documents={getSavedDocuments()}
          onSelect={handleOpenSelect}
          onClose={() => setShowOpenDialog(false)}
        />
      )}

      {showSaveAsDialog && (
        <SaveAsDialog
          currentName={activeDoc?.name || ''}
          onSave={handleSaveAsConfirm}
          onClose={() => setShowSaveAsDialog(false)}
        />
      )}

      {showFindReplace && (
        <FindReplaceDialog
          onFind={handleFind}
          onReplace={handleReplace}
          onClose={() => setShowFindReplace(false)}
          resultCount={editorState.findHighlights.length}
        />
      )}
    </>
  );
}
