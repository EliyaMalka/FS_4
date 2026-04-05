import './Modals.css';

export default function SavePrompt({ docName, onSave, onDiscard, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} id="save-prompt-modal">
        <div className="modal-header">
          <h2 className="modal-title">Unsaved Changes</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p className="save-prompt-message">
            Do you want to save changes to <strong>"{docName}"</strong> before closing?
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn danger" onClick={onDiscard} id="btn-discard">
            Don't Save
          </button>
          <button className="modal-btn primary" onClick={onSave} id="btn-save-confirm">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
