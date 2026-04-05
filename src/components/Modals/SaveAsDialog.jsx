import { useState } from 'react';
import './Modals.css';

export default function SaveAsDialog({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSave(trimmed);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} id="save-as-modal">
        <div className="modal-header">
          <h2 className="modal-title">💾 Save As</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <input
              className="modal-input"
              type="text"
              placeholder="Enter document name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              id="save-as-input"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn primary" disabled={!name.trim()}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
