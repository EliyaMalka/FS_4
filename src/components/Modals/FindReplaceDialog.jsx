/**
 * ==============================================
 * FindReplaceDialog.jsx — חלון חיפוש והחלפה
 * ==============================================
 * חלון קופץ עם שתי פונקציות:
 *   1. חיפוש (Find) — בזמן אמת! כל תו שמקלידים בשדה Find מדגיש מיד את
 *      כל המופעים בטקסט (דרך findHighlights ב-useEditorState)
 *   2. החלפה (Replace All) — מחליף את כל המופעים של טקסט החיפוש בטקסט ההחלפה
 *
 * כפתור "Replace All" חסום (אפור) כשאין תוצאות חיפוש, ונהפך לפעיל רק כשנמצאו מופעים.
 * מציג גם ספירה: "Found X occurrence(s)" או "No matches found".
 */
import { useState, useEffect } from 'react';
import './Modals.css';

export default function FindReplaceDialog({ onFind, onReplace, onClose, resultCount }) {
  const [findStr, setFindStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');

  // Live search as user types
  useEffect(() => {
    onFind(findStr);
  }, [findStr, onFind]);

  // Clear highlights on close
  const handleClose = () => {
    onFind('');
    onClose();
  };

  const handleReplace = () => {
    if (findStr.trim()) {
      onReplace(findStr, replaceStr);
      setFindStr('');
      setReplaceStr('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()} id="find-replace-modal">
        <div className="modal-header">
          <h2 className="modal-title">🔍 Find & Replace</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="find-replace-row">
            <label>Find:</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Search text..."
              value={findStr}
              onChange={(e) => setFindStr(e.target.value)}
              autoFocus
              id="find-input"
            />
          </div>
          <div className="find-replace-row">
            <label>Replace:</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Replace with..."
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              id="replace-input"
            />
          </div>
          {findStr && (
            <div className="find-replace-results">
              {resultCount > 0
                ? `Found ${resultCount} occurrence(s)`
                : 'No matches found'}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={handleClose}>
            Close
          </button>
          <button
            className={`modal-btn ${resultCount > 0 ? 'primary' : 'disabled-replace'}`}
            onClick={handleReplace}
            disabled={!findStr.trim() || resultCount === 0}
            id="btn-replace-all"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
}
