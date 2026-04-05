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
