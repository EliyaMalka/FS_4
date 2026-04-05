import './Modals.css';

export default function OpenFileDialog({ documents, onSelect, onClose }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never saved';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} id="open-file-modal">
        <div className="modal-header">
          <h2 className="modal-title">📂 Open Document</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {documents.length === 0 ? (
            <div className="file-list-empty">
              No saved documents found. Create a new one!
            </div>
          ) : (
            <div className="file-list">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="file-item"
                  onClick={() => onSelect(doc)}
                >
                  <div>
                    <div className="file-item-name">📄 {doc.name}</div>
                    <div className="file-item-meta">
                      {doc.chars.length} characters · Last saved: {formatDate(doc.savedAt || doc.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
