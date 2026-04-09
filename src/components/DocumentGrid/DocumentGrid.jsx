/**
 * ==============================================
 * DocumentGrid.jsx — תצוגת גריד של המסמכים הפתוחים
 * ==============================================
 * מציגה כרטיסיות (cards) של כל המסמכים שפתוחים כרגע.
 * כל כרטיסייה מציגה:
 *   - שם המסמך (לחיצה כפולה לשינוי שם)
 *   - תצוגה מקדימה של התוכן עם העיצוב (StyledPreview)
 *   - מספר תווים ומילים
 *   - סימון "Active" למסמך שנמצא בעריכה
 *   - נקודה כתומה אם יש שינויים לא שמורים
 *   - כפתור X לסגירת המסמך
 *
 * כולל StyledPreview — רכיב פנימי שמרנדר את 100 התווים הראשונים
 * עם כל הסטיילים שלהם (צבע, גופן, bold וכו') ישירות בתוך הכרטיסייה.
 */
import { useState } from 'react';
import './DocumentGrid.css';

function StyledPreview({ chars }) {
  if (!chars || chars.length === 0) {
    return <span className="doc-card-preview-empty">Empty document</span>;
  }

  // Show up to 120 characters with their actual styles
  const previewChars = chars.slice(0, 120);

  return (
    <>
      {previewChars.map((ch, i) => {
        if (ch.char === '\n') {
          return <br key={ch.id || i} />;
        }
        const style = {
          color: ch.color || '#e8e8f0',
          fontSize: Math.min(parseInt(ch.fontSize) || 14, 14) + 'px', // cap at 14px for preview
          fontFamily: ch.fontFamily || 'inherit',
          fontWeight: ch.bold ? 'bold' : 'normal',
          fontStyle: ch.italic ? 'italic' : 'normal',
          textDecoration: ch.underline ? 'underline' : 'none',
        };
        return (
          <span key={ch.id || i} style={style}>
            {ch.char}
          </span>
        );
      })}
      {chars.length > 120 && <span style={{ color: 'var(--text-muted)' }}>…</span>}
    </>
  );
}

function DocumentCard({ doc, isActive, onSelect, onClose, hasUnsaved, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(doc.name);

  const handleClose = (e) => {
    e.stopPropagation();
    onClose(doc.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditName(doc.name);
    setIsEditing(true);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = editName.trim();
    if (trimmed && trimmed !== doc.name) {
      onRename(doc.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(doc.name);
    }
  };

  const charCount = doc.chars.length;
  const wordCount = doc.chars.map(c => c.char).join('').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className={`doc-card ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(doc.id)}
      id={`doc-card-${doc.id}`}
    >
      <div className="doc-card-header">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="doc-card-rename-form" onClick={e => e.stopPropagation()}>
            <input
              className="doc-card-rename-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleRenameKeyDown}
              autoFocus
              maxLength={30}
            />
          </form>
        ) : (
          <span
            className="doc-card-title"
            onDoubleClick={handleDoubleClick}
            title="Double-click to rename"
          >
            {doc.name}
          </span>
        )}
        <button
          className="doc-card-close"
          onClick={handleClose}
          title="Close document"
        >
          ×
        </button>
      </div>

      <div className="doc-card-preview">
        <StyledPreview chars={doc.chars} />
      </div>

      <div className="doc-card-footer">
        <span className="doc-card-meta">
          {charCount} chars · {wordCount} words
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {isActive && <span className="doc-card-badge active">Active</span>}
          {hasUnsaved && <span className="doc-card-badge unsaved">Unsaved</span>}
        </div>
      </div>
    </div>
  );
}

export default function DocumentGrid({ docs, activeDocId, onSelect, onClose, hasUnsavedChanges, onRename }) {
  if (docs.length === 0) return null;

  return (
    <div className="doc-grid" id="document-grid">
      {docs.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isActive={doc.id === activeDocId}
          onSelect={onSelect}
          onClose={onClose}
          hasUnsaved={hasUnsavedChanges(doc.id)}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
