import { useCallback } from 'react';

export default function TextDisplay({ chars, cursorPosition, findHighlights, onClickPosition, language }) {
  const handleClick = useCallback((e) => {
    // Find which character was clicked based on data-index
    const target = e.target;
    const index = target.getAttribute('data-index');
    if (index !== null) {
      onClickPosition(parseInt(index, 10) + 1);
    } else {
      // Clicked on empty space — place cursor at end
      onClickPosition(chars.length);
    }
  }, [chars.length, onClickPosition]);

  const isRtl = language === 'hebrew';

  const renderChars = () => {
    const elements = [];

    for (let i = 0; i <= chars.length; i++) {
      // Render cursor at this position
      if (i === cursorPosition) {
        elements.push(
          <span key="cursor" className="cursor-blink" />
        );
      }

      // Render the character
      if (i < chars.length) {
        const ch = chars[i];
        const isHighlighted = findHighlights.includes(i);
        const style = {
          color: ch.color,
          fontSize: ch.fontSize,
          fontFamily: ch.fontFamily,
          fontWeight: ch.bold ? 'bold' : 'normal',
          fontStyle: ch.italic ? 'italic' : 'normal',
          textDecoration: ch.underline ? 'underline' : 'none',
        };

        if (ch.char === '\n') {
          elements.push(
            <span key={ch.id} data-index={i} className={`char-span ${isHighlighted ? 'highlighted' : ''}`} style={style}>
              {'\n'}
            </span>
          );
        } else {
          elements.push(
            <span key={ch.id} data-index={i} className={`char-span ${isHighlighted ? 'highlighted' : ''}`} style={style}>
              {ch.char}
            </span>
          );
        }
      }
    }

    return elements;
  };

  return (
    <div
      className={`text-display ${isRtl ? 'rtl' : ''}`}
      onClick={handleClick}
      tabIndex={0}
      id="text-display"
    >
      {chars.length === 0 && cursorPosition === 0 && (
        <>
          <span className="cursor-blink" />
          <span style={{ color: 'var(--text-muted)', pointerEvents: 'none' }}>
            Start typing...
          </span>
        </>
      )}
      {chars.length > 0 && renderChars()}
    </div>
  );
}
