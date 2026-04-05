import './AppLayout.css';

export default function AppLayout({
  user,
  onLogout,
  toolbar,
  documentGrid,
  editor,
  keyboard,
  showKeyboard,
  hasOpenDocs,
  onNewDocument,
}) {
  return (
    <div className="app-layout">
      {/* Top Bar */}
      <header className="app-topbar">
        <div className="app-topbar-left">
          <div className="app-brand">
            <div className="app-brand-icon">✦</div>
            <span>Visual Editor</span>
          </div>
          {toolbar}
        </div>
        <div className="app-topbar-right">
          <div className="app-user-info">
            <div className="app-user-avatar">
              {user.charAt(0)}
            </div>
            <span>{user}</span>
          </div>
          <button id="logout-btn" className="app-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        {!hasOpenDocs ? (
          <div className="app-empty-state">
            <div className="app-empty-icon">📝</div>
            <h2>No Documents Open</h2>
            <p>Create a new document or open an existing one to start editing.</p>
            <button className="app-empty-btn" onClick={onNewDocument}>
              + New Document
            </button>
          </div>
        ) : (
          <>
            {/* Document Grid (Top Area) */}
            <div className={`app-doc-grid-section ${!showKeyboard ? 'expanded' : ''}`}>
              {documentGrid}
            </div>

            {/* Editor Section (Bottom Area) */}
            <div className={`app-editor-section ${!showKeyboard ? 'keyboard-hidden' : ''}`}>
              {editor}
              {keyboard}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
