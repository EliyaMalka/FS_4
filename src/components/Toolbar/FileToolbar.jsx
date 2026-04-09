/**
 * ==============================================
 * FileToolbar.jsx — סרגל כלים עליון לניהול קבצים
 * ==============================================
 * הסרגל שמוצג בראש המסך עם כפתורי פעולה על מסמכים:
 *   - New — יצירת מסמך חדש ריק
 *   - Open — פתיחת חלון בחירת מסמך שמור
 *   - Save — שמירת המסמך הנוכחי
 *   - Save As — שמירה בשם חדש
 *   - Close — סגירת המסמך הנוכחי
 *
 * כפתורי Save/Save As/Close חסומים כשאין מסמך פעיל.
 */
import './Toolbar.css';

export default function FileToolbar({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onClose,
  hasActiveDoc,
}) {
  return (
    <div className="file-toolbar" id="file-toolbar">
      <button id="btn-new" className="toolbar-btn" onClick={onNew}>
        <span className="btn-icon">📄</span> New
      </button>
      <button id="btn-open" className="toolbar-btn" onClick={onOpen}>
        <span className="btn-icon">📂</span> Open
      </button>
      <button id="btn-save" className="toolbar-btn" onClick={onSave} disabled={!hasActiveDoc}>
        <span className="btn-icon">💾</span> Save
      </button>
      <button id="btn-save-as" className="toolbar-btn" onClick={onSaveAs} disabled={!hasActiveDoc}>
        <span className="btn-icon">📋</span> Save As
      </button>
      <button id="btn-close" className="toolbar-btn" onClick={onClose} disabled={!hasActiveDoc}>
        <span className="btn-icon">✖</span> Close
      </button>
    </div>
  );
}
