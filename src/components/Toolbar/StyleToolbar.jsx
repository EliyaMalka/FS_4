import { FONT_FAMILIES, FONT_SIZES, STYLE_SCOPE } from '../../utils/constants';
import './Toolbar.css';

export default function StyleToolbar({ editorState }) {
  const {
    activeStyle,
    styleScope,
    applyStyleChange,
    toggleStyleProp,
    setStyleScope,
  } = editorState;

  return (
    <div className="style-toolbar" id="style-toolbar">
      {/* Font Family */}
      <div className="style-toolbar-group">
        <select
          id="font-family-select"
          className="toolbar-select"
          value={activeStyle.fontFamily}
          onChange={(e) => applyStyleChange('fontFamily', e.target.value)}
        >
          {FONT_FAMILIES.map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="style-toolbar-group">
        <select
          id="font-size-select"
          className="toolbar-select"
          value={activeStyle.fontSize}
          onChange={(e) => applyStyleChange('fontSize', e.target.value)}
          style={{ minWidth: '70px' }}
        >
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="style-toolbar-divider" />

      {/* Bold / Italic / Underline */}
      <div className="style-toolbar-group">
        <button
          id="btn-bold"
          className={`toolbar-btn ${activeStyle.bold ? 'active' : ''}`}
          onClick={() => toggleStyleProp('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          id="btn-italic"
          className={`toolbar-btn ${activeStyle.italic ? 'active' : ''}`}
          onClick={() => toggleStyleProp('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          id="btn-underline"
          className={`toolbar-btn ${activeStyle.underline ? 'active' : ''}`}
          onClick={() => toggleStyleProp('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      <div className="style-toolbar-divider" />

      {/* Color Picker */}
      <div className="style-toolbar-group">
        <div className="toolbar-color-btn" style={{ backgroundColor: activeStyle.color }}>
          <input
            id="color-picker"
            type="color"
            className="toolbar-color-input"
            value={activeStyle.color}
            onChange={(e) => applyStyleChange('color', e.target.value)}
            title="Text color"
          />
        </div>
      </div>

      <div className="style-toolbar-divider" />

      {/* Styling Scope Toggle */}
      <div className="scope-toggle">
        <button
          id="scope-all"
          className={`scope-toggle-btn ${styleScope === STYLE_SCOPE.ALL ? 'active' : ''}`}
          onClick={() => setStyleScope(STYLE_SCOPE.ALL)}
          title="Apply style changes to all existing text"
        >
          Apply to All
        </button>
        <button
          id="scope-from-here"
          className={`scope-toggle-btn ${styleScope === STYLE_SCOPE.FROM_HERE ? 'active' : ''}`}
          onClick={() => setStyleScope(STYLE_SCOPE.FROM_HERE)}
          title="Apply style only to newly typed text"
        >
          From Here On
        </button>
      </div>
    </div>
  );
}
