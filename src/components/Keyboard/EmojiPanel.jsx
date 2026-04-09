/**
 * ==============================================
 * EmojiPanel.jsx — פאנל בחירת אימוג'ים
 * ==============================================
 * קומפוננטה פשוטה שמציגה רשת (grid) של אימוג'ים מתוך EMOJI_LIST.
 * כשלוחצים על אימוג'י — הוא מוכנס לטקסט במיקום הסמן הנוכחי.
 * הפאנל נפתח/נסגר ע"י כפתור "😀 Emoji" במקלדת הווירטואלית.
 */
import { EMOJI_LIST } from '../../utils/constants';

export default function EmojiPanel({ onSelect }) {
  return (
    <div className="emoji-panel" id="emoji-panel">
      {EMOJI_LIST.map((emoji, i) => (
        <button
          key={i}
          className="emoji-btn"
          onClick={() => onSelect(emoji)}
          title={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
