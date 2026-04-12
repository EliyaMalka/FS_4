// ייבוא הוקים (hooks) מובנים של ריאקט — useState לניהול סטייט, useCallback למניעת רינדורים מיותרים
import { useState, useCallback } from 'react';
// ייבוא הוק מותאם אישית לניהול התחברות/הרשמה/התנתקות של משתמשים
import { useAuth } from './hooks/useAuth';
// ייבוא הוק מותאם אישית לניהול מסמכים — יצירה, פתיחה, שמירה, סגירה
import { useDocuments } from './hooks/useDocuments';
// ייבוא הוק מותאם אישית לניהול מצב העורך — סמן, סטיילינג, undo, חיפוש והחלפה
import { useEditorState } from './hooks/useEditorState';

// ייבוא קומפוננטות (רכיבי UI) של האפליקציה
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

// ייבוא קובץ העיצוב הראשי של הקומפוננטה
import './App.css';

// הקומפוננטה הראשית של האפליקציה — כל מה שמוצג על המסך מתחיל מכאן
export default function App() {
  // שליפת מידע על המשתמש המחובר, מצב טעינה, ופונקציות התחברות/הרשמה/יציאה
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();

  // משתני סטייט לשליטה בחלונות קופצים (מודאלים) — האם הם פתוחים או סגורים
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  // שומר את מזהה המסמך שמחכה לאישור סגירה (כשיש שינויים שלא נשמרו)
  const [pendingCloseDocId, setPendingCloseDocId] = useState(null);
  // האם חלונית העריכה מוצגת — true=מוצגת, false=רק הפתקים נראים
  const [editorVisible, setEditorVisible] = useState(false);

  // חיבור למנהל המסמכים — מקבל את כל הפונקציות לניהול מסמכים של המשתמש הנוכחי
  const docManager = useDocuments(user);
  const {
    openDocs,            // מערך כל המסמכים הפתוחים כרגע
    activeDoc,           // המסמך הפעיל שנמצא עכשיו בעריכה (אובייקט שלם)
    activeDocId,         // מזהה (ID) של המסמך הפעיל
    setActiveDocId,      // פונקציה לבחירת מסמך פעיל חדש
    newDocument,         // פונקציה ליצירת מסמך חדש ריק
    openDocument,        // פונקציה לפתיחת מסמך שמור מהזיכרון
    getSavedDocuments,   // פונקציה שמחזירה את כל המסמכים השמורים של המשתמש
    save,                // שמירת המסמך הפעיל
    saveAs,              // שמירה בשם חדש
    closeDocument,       // סגירת מסמך
    updateActiveDocChars,// עדכון תוכן (מערך תווים) של המסמך הפעיל
    hasUnsavedChanges,   // בדיקה אם יש שינויים שלא נשמרו במסמך מסוים
    renameDocument,      // שינוי שם של מסמך
  } = docManager;

  // חיבור למצב העורך — מנהל סמן, עיצוב, Undo, חיפוש וכו'
  // מקבל את המסמך הפעיל ופונקציה לעדכון התוכן שלו
  const editorState = useEditorState(activeDoc, updateActiveDocChars);

  // פונקציה ליצירת מסמך חדש — יוצר מסמך ומציג את חלונית העריכה
  const handleNew = useCallback(() => {
    newDocument();
    setEditorVisible(true);
  }, [newDocument]);

  // פונקציה לבחירת מסמך מהגריד — כשלוחצים על פתק, הוא נבחר והעורך מוצג
  const handleSelectDoc = useCallback((docId) => {
    setActiveDocId(docId);
    setEditorVisible(true);
  }, [setActiveDocId]);

  // פונקציה להצגה/הסתרה של חלונית העריכה (כפתור X)
  const handleToggleEditor = useCallback(() => {
    setEditorVisible(false);
    setActiveDocId(null);
  }, []);

  // פונקציה לפתיחת חלון "Open" — מציגה את רשימת הקבצים השמורים
  const handleOpen = useCallback(() => {
    setShowOpenDialog(true);
  }, []);

  // פונקציה לשמירת המסמך הפעיל
  const handleSave = useCallback(() => {
    if (activeDoc) {
      save();
    }
  }, [activeDoc, save]);

  // פונקציה לשמירה בשם חדש — פותחת חלון "Save As"
  const handleSaveAs = useCallback(() => {
    if (activeDoc) {
      setShowSaveAsDialog(true);
    }
  }, [activeDoc]);

  // פונקציה לסגירת מסמך — אם יש שינויים לא שמורים, שואלת את המשתמש מה לעשות
  const handleClose = useCallback((docId = null) => {
    const id = docId || activeDocId;
    if (!id) return;

    if (hasUnsavedChanges(id)) {
      setPendingCloseDocId(id);
    } else {
      closeDocument(id);
    }
  }, [activeDocId, hasUnsavedChanges, closeDocument]);

  // פונקציות לטיפול בחלון "שמור לפני סגירה" — שלוש אפשרויות:
  // 1. שמור וסגור — שומר את המסמך ואז סוגר אותו
  const handleSaveAndClose = useCallback(() => {
    if (pendingCloseDocId) {
      const doc = openDocs.find(d => d.id === pendingCloseDocId);
      if (doc) save(doc);
      closeDocument(pendingCloseDocId);
      setPendingCloseDocId(null);
    }
  }, [pendingCloseDocId, openDocs, save, closeDocument]);

  // 2. בטל שינויים וסגור — סוגר בלי לשמור
  const handleDiscardAndClose = useCallback(() => {
    if (pendingCloseDocId) {
      closeDocument(pendingCloseDocId);
      setPendingCloseDocId(null);
    }
  }, [pendingCloseDocId, closeDocument]);

  // 3. ביטול — חוזר למסמך בלי לסגור אותו
  const handleCancelClose = useCallback(() => {
    setPendingCloseDocId(null);
  }, []);

  // פונקציה שמופעלת כשבוחרים מסמך מחלון "Open" — פותחת אותו וסוגרת את החלון
  const handleOpenSelect = useCallback((doc) => {
    openDocument(doc);
    setShowOpenDialog(false);
  }, [openDocument]);

  // פונקציה שמופעלת כשמאשרים שם חדש בחלון "Save As" — שומרת בשם ומסגרת את החלון
  const handleSaveAsConfirm = useCallback((newName) => {
    saveAs(newName);
    setShowSaveAsDialog(false);
  }, [saveAs]);

  // פונקציות חיפוש והחלפה — מעבירות את הבקשה להוק של העורך
  const handleFind = useCallback((str) => {
    return editorState.findInText(str);
  }, [editorState]);

  const handleReplace = useCallback((findStr, replaceStr) => {
    if (editorState.findInText(findStr)) {
      editorState.replaceInText(findStr, replaceStr);
    }
  }, [editorState]);

  // מצב טעינה — מציג ספינר בזמן שהמערכת בודקת אם יש משתמש מחובר
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        Loading...
      </div>
    );
  }

  // בדיקת הרשאות — אם המשתמש לא מחובר, מציג את מסך ההתחברות/הרשמה
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  // מציאת שם המסמך שמחכה לאישור סגירה (לחלון הקופץ)
  const pendingCloseDoc = pendingCloseDocId
    ? openDocs.find(d => d.id === pendingCloseDocId)
    : null;

  // ============================================
  // הרינדור הראשי של האפליקציה (מה שרואים על המסך)
  // ============================================
  return (
    <>
      {/* קומפוננטת המבנה הראשי — מקבלת את כל החלקים ומסדרת אותם על המסך */}
      <AppLayout
        user={user}
        onLogout={logout}
        hasOpenDocs={openDocs.length > 0}
        onNewDocument={handleNew}
        showKeyboard={editorState.showKeyboard}
        editorVisible={editorVisible}
        onToggleEditor={handleToggleEditor}

        // סרגל כלים עליון — כפתורי New, Open, Save, Save As, Close
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

        // גריד הפתקים — תצוגת כרטיסיות של כל המסמכים הפתוחים
        documentGrid={
          <DocumentGrid
            docs={openDocs}
            activeDocId={activeDocId}
            onSelect={handleSelectDoc}
            onClose={handleClose}
            hasUnsavedChanges={hasUnsavedChanges}
            onRename={renameDocument}
          />
        }

        // חלונית העריכה — סרגלי עיצוב + אזור הטקסט, או הודעה אם לא נבחר מסמך
        editor={
          activeDoc ? (
            <>
              {/* סרגל עיצוב — גופן, גודל, צבע, Bold, Italic, Underline */}
              <StyleToolbar editorState={editorState} />
              {/* סרגל עריכה — מחיקה, Undo, חיפוש והחלפה, שפה */}
              <EditToolbar
                editorState={editorState}
                onFindReplace={() => setShowFindReplace(true)}
              />
              {/* אזור התצוגה הראשי של הטקסט — כאן רואים את מה שכותבים */}
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

        // המקלדת הווירטואלית — מוצגת רק כשיש מסמך פעיל
        keyboard={
          activeDoc ? (
            <VirtualKeyboard editorState={editorState} />
          ) : null
        }
      />

      {/* ========== חלונות קופצים (מודאלים) ========== */}

      {/* חלון "שמור לפני סגירה" — מופיע כשסוגרים מסמך עם שינויים לא שמורים */}
      {pendingCloseDoc && (
        <SavePrompt
          docName={pendingCloseDoc.name}
          onSave={handleSaveAndClose}
          onDiscard={handleDiscardAndClose}
          onCancel={handleCancelClose}
        />
      )}

      {/* חלון "פתיחת קובץ" — מציג רשימת מסמכים שמורים לבחירה */}
      {showOpenDialog && (
        <OpenFileDialog
          documents={getSavedDocuments()}
          onSelect={handleOpenSelect}
          onClose={() => setShowOpenDialog(false)}
        />
      )}

      {/* חלון "שמירה בשם" — מאפשר לבחור שם חדש למסמך */}
      {showSaveAsDialog && (
        <SaveAsDialog
          currentName={activeDoc?.name || ''}
          onSave={handleSaveAsConfirm}
          onClose={() => setShowSaveAsDialog(false)}
        />
      )}

      {/* חלון "חיפוש והחלפה" — חיפוש טקסט והחלפתו */}
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
