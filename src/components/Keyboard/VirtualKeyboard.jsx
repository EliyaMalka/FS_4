/**
 * ==============================================
 * VirtualKeyboard.jsx — מקלדת וירטואלית על המסך
 * ==============================================
 * קומפוננטה שמציגה מקלדת שלמה על המסך — מאפשרת הקלדה בלי מקלדת פיזית.
 *
 * כוללת:
 *   - 4 שורות של כפתורי אותיות/מספרים (בהתאם לשפה ומצב Shift)
 *   - שורה תחתונה עם כפתורים מיוחדים: שפה, אימוג'י, רווח, Enter, חצים
 *   - כפתור Shift — מחליף למצב אותיות גדולות (באנגלית)
 *   - כפתור Backspace — מוחק תו אחורה
 *   - כפתור Tab — מוסיף טאב
 *   - תמיכה במקלדת עברית ואנגלית (נטען מ-KEYBOARD_LAYOUTS)
 *
 * Shift מתבטל אוטומטית אחרי הקלדת תו אחד (כמו במקלדת טלפון).
 */
import { useState } from 'react';
import { KEYBOARD_LAYOUTS } from '../../utils/constants';
import EmojiPanel from './EmojiPanel';
import './Keyboard.css';

export default function VirtualKeyboard({ editorState }) {
  const [showEmoji, setShowEmoji] = useState(false);

  const {
    language,
    showKeyboard,
    shiftActive,
    insertChar,
    insertNewline,
    deleteCharBefore,
    moveCursor,
    toggleShift,
    toggleLanguage,
  } = editorState;

  if (!showKeyboard) return null;

  const layout = KEYBOARD_LAYOUTS[language];
  const rows = shiftActive ? layout.shiftRows : layout.rows;

  const handleKey = (char) => {
    insertChar(char);
    // Auto-disable shift after typing a character
    if (shiftActive) toggleShift();
  };

  const handleEmoji = (emoji) => {
    insertChar(emoji);
  };

  return (
    <div className={`keyboard-container ${!showKeyboard ? 'hidden' : ''}`} id="virtual-keyboard">
      {/* Emoji Panel */}
      {showEmoji && <EmojiPanel onSelect={handleEmoji} />}

      {/* Keyboard Rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="keyboard-row">
          {/* Shift key on the last row */}
          {rowIdx === rows.length - 1 && (
            <button
              className={`kb-key wide ${shiftActive ? 'active' : ''}`}
              onClick={toggleShift}
              id="kb-shift"
            >
              ⇧ Shift
            </button>
          )}

          {row.map((key, keyIdx) => (
            <button
              key={keyIdx}
              className="kb-key"
              onClick={() => handleKey(key)}
            >
              {key}
            </button>
          ))}

          {/* Backspace on the first row */}
          {rowIdx === 0 && (
            <button
              className="kb-key wide backspace"
              onClick={deleteCharBefore}
              id="kb-backspace"
            >
              ⌫
            </button>
          )}

          {/* Tab on the second row */}
          {rowIdx === 1 && (
            <button
              className="kb-key wide"
              onClick={() => insertChar('\t')}
              id="kb-tab"
            >
              Tab ⇥
            </button>
          )}
        </div>
      ))}

      {/* Bottom Row: Special Keys */}
      <div className="keyboard-bottom-row">
        <button
          className={`kb-key wide ${language === 'hebrew' ? 'active' : ''}`}
          onClick={toggleLanguage}
          id="kb-lang"
        >
          🌐 {language === 'english' ? 'EN' : 'HE'}
        </button>
        <button
          className={`kb-key wide ${showEmoji ? 'active' : ''}`}
          onClick={() => setShowEmoji(!showEmoji)}
          id="kb-emoji"
        >
          😀 Emoji
        </button>
        <button
          className="kb-key space"
          onClick={() => insertChar(' ')}
          id="kb-space"
        >
          Space
        </button>
        <button
          className="kb-key wide enter"
          onClick={insertNewline}
          id="kb-enter"
        >
          Enter ↵
        </button>
        <button
          className="kb-key wide"
          onClick={() => moveCursor('left')}
          id="kb-left"
        >
          ◀
        </button>
        <button
          className="kb-key wide"
          onClick={() => moveCursor('right')}
          id="kb-right"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
