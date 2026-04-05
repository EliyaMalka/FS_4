import './DocumentGrid.css';

function DocumentCard({ doc, isActive, onSelect, onClose, hasUnsaved }) {
  const previewText = doc.chars.map(c => c.char).join('').substring(0, 200);

  const handleClose = (e) => {
    e.stopPropagation();
    onClose(doc.id);
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
        <span className="doc-card-title">{doc.name}</span>
        <button
          className="doc-card-close"
          onClick={handleClose}
          title="Close document"
        >
          ×
        </button>
      </div>

      <div className={`doc-card-preview ${!previewText ? 'doc-card-preview-empty' : ''}`}>
        {previewText || 'Empty document'}
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

export default function DocumentGrid({ docs, activeDocId, onSelect, onClose, hasUnsavedChanges }) {
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
        />
      ))}
    </div>
  );
}
