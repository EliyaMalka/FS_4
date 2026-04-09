/**
 * ==============================================
 * EditToolbar.jsx — סרגל כלי עריכה
 * ==============================================
 * סרגל הכלים השני שמכיל פעולות עריכה ושליטה:
 *
 * פעולות מחיקה:
 *   - Del Char — מחיקת תו אחד אחורה (כמו Backspace)
 *   - Del Word — מחיקת מילה שלמה אחורה (כמו Ctrl+Backspace)
 *   - Clear All — מחיקת כל הטקסט (עם אישור confirm)
 *
 * פעולות מתקדמות:
 *   - Undo — ביטול הפעולה האחרונה
 *   - Find & Replace — פתיחת חלון חיפוש והחלפה
 *
 * שליטה:
 *   - כפתור שפה (EN/HE) — מחליף בין מקלדת אנגלית לעברית
 *   - Hide/Show KB — הצגה/הסתרה של המקלדת הווירטואלית (מוצב בצד ימין)
 */
import { useState } from 'react';
import './Toolbar.css';

export default function EditToolbar({ editorState, onFindReplace }) {
  const {
    deleteCharBefore,
    deleteWordBefore,
    clearAll,
    undo,
    language,
    showKeyboard,
    toggleLanguage,
    toggleKeyboard,
  } = editorState;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all text? This action can be undone.')) {
      clearAll();
    }
  };

  return (
    <div className="edit-toolbar" id="edit-toolbar">
      {/* Editing Actions */}
      <div className="style-toolbar-group">
        <button id="btn-delete-char" className="toolbar-btn" onClick={deleteCharBefore} title="Delete Character">
          <span className="btn-icon">⌫</span> Del Char
        </button>
        <button id="btn-delete-word" className="toolbar-btn" onClick={deleteWordBefore} title="Delete Word">
          <span className="btn-icon">⌦</span> Del Word
        </button>
        <button id="btn-clear-all" className="toolbar-btn danger" onClick={handleClearAll} title="Clear All Text">
          <span className="btn-icon">🗑️</span> Clear All
        </button>
      </div>

      <div className="style-toolbar-divider" />

      {/* Advanced Actions */}
      <div className="style-toolbar-group">
        <button id="btn-undo" className="toolbar-btn accent" onClick={undo} title="Undo (Ctrl+Z)">
          <span className="btn-icon">↩️</span> Undo
        </button>
        <button id="btn-find-replace" className="toolbar-btn" onClick={onFindReplace} title="Find & Replace">
          <span className="btn-icon">🔍</span> Find & Replace
        </button>
      </div>

      <div className="style-toolbar-divider" />

      {/* Language Toggle */}
      <div className="style-toolbar-group">
        <button
          id="btn-lang-toggle"
          className={`toolbar-btn ${language === 'hebrew' ? 'active' : ''}`}
          onClick={toggleLanguage}
          title="Toggle Language"
        >
          <span className="btn-icon">🌐</span> {language === 'english' ? 'EN' : 'HE'}
        </button>
      </div>

      {/* Keyboard Toggle - pushed to right */}
      <button
        id="btn-keyboard-toggle"
        className={`toolbar-btn keyboard-toggle-btn ${showKeyboard ? 'active' : ''}`}
        onClick={toggleKeyboard}
        title={showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
      >
        <span className="btn-icon">⌨️</span> {showKeyboard ? 'Hide KB' : 'Show KB'}
      </button>
    </div>
  );
}
