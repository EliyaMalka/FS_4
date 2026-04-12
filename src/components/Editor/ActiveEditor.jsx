import { useEffect, useCallback, useRef } from 'react';
import TextDisplay from './TextDisplay';
import './Editor.css';

export default function ActiveEditor({ editorState, showKeyboard }) {
  const containerRef = useRef(null);

  const {
    chars,
    cursorPosition,
    findHighlights,
    language,
    insertChar,
    insertNewline,
    deleteCharBefore,
    deleteCharAt,
    moveCursor,
    setCursorTo,
    deleteWordBefore,
    undo,
    findInText,
  } = editorState;

  const clearHighlightsIfExist = useCallback(() => {
    if (findHighlights && findHighlights.length > 0) {
      findInText('');
    }
  }, [findHighlights, findInText]);

  // Handle physical keyboard input
  const handleKeyDown = useCallback((e) => {
    // Ignore if a modal/dialog input is focused
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    clearHighlightsIfExist();

    // Ctrl shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        deleteWordBefore();
        return;
      }
      return; // Don't process other ctrl combos
    }

    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        deleteCharBefore();
        break;
      case 'Delete':
        e.preventDefault();
        deleteCharAt();
        break;
      case 'Enter':
        e.preventDefault();
        insertNewline();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveCursor('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveCursor('right');
        break;
      case 'Home':
        e.preventDefault();
        moveCursor('home');
        break;
      case 'End':
        e.preventDefault();
        moveCursor('end');
        break;
      default:
        // Insert printable characters
        if (e.key.length === 1 && !e.altKey) {
          e.preventDefault();
          insertChar(e.key);
        }
        break;
    }
  }, [insertChar, insertNewline, deleteCharBefore, deleteCharAt, moveCursor, undo, deleteWordBefore, clearHighlightsIfExist]);

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="editor-container"
      ref={containerRef}
      onClick={clearHighlightsIfExist}
    >
      {chars !== undefined ? (
        <div className={`text-display-wrapper ${!showKeyboard ? 'expanded' : ''}`}>
          <TextDisplay
            chars={chars}
            cursorPosition={cursorPosition}
            findHighlights={findHighlights}
            onClickPosition={(pos) => {
              setCursorTo(pos);
              clearHighlightsIfExist();
            }}
            language={language}
          />
        </div>
      ) : (
        <div className="editor-no-doc">
          <span>📄</span>
          <span>Select a document to start editing</span>
        </div>
      )}
    </div>
  );
}