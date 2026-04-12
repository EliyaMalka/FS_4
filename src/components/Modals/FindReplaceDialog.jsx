import { useState } from 'react';
import './Modals.css';

export default function FindReplaceDialog({ onFind, onReplace, onClose, resultCount }) {
  const [findStr, setFindStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');

  // 1. משתנה חדש שזוכר האם כבר לחצנו על "Find"
  const [hasSearched, setHasSearched] = useState(false);

  const handleClose = () => {
    onClose();
  };

  // 2. הפונקציה של כפתור החיפוש
  const handleFind = () => {
    if (findStr.trim()) {
      onFind(findStr);
      setHasSearched(true); // עכשיו מותר להציג את שורת התוצאות!
    }
  };

  const handleReplace = () => {
    if (findStr.trim()) {
      onReplace(findStr, replaceStr);
      handleClose();
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
              // 3. כשמקלידים משהו חדש, אנחנו מנקים ומסתירים את התוצאות הישנות
              onChange={(e) => {
                setFindStr(e.target.value);
                onFind('');
                setHasSearched(false);
              }}
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
          {/* 4. מציג את התוצאות אך ורק אם לחצו על הכפתור (hasSearched הוא true) */}
          {hasSearched && findStr && (
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
            className={`modal-btn ${findStr.trim() ? 'primary' : 'disabled-replace'}`}
            onClick={handleFind}
            disabled={!findStr.trim()}
          >
            Find
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