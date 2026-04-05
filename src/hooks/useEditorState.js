import { useState, useCallback, useRef } from 'react';
import { createCharObject, DEFAULT_STYLE } from '../utils/charFactory';
import { STYLE_SCOPE } from '../utils/constants';

const MAX_UNDO_HISTORY = 50;

export function useEditorState(activeDoc, updateActiveDocChars) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeStyle, setActiveStyle] = useState({ ...DEFAULT_STYLE });
  const [styleScope, setStyleScope] = useState(STYLE_SCOPE.FROM_HERE);
  const [language, setLanguage] = useState('english');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [shiftActive, setShiftActive] = useState(false);
  const [findHighlights, setFindHighlights] = useState([]);

  const undoStackRef = useRef([]);

  const chars = activeDoc?.chars || [];

  // Push current state to undo stack
  const pushUndo = useCallback(() => {
    if (!activeDoc) return;
    undoStackRef.current = [
      ...undoStackRef.current.slice(-MAX_UNDO_HISTORY + 1),
      { chars: [...activeDoc.chars], cursorPosition },
    ];
  }, [activeDoc, cursorPosition]);

  // Insert a character at cursor position
  const insertChar = useCallback((char) => {
    if (!activeDoc) return;
    pushUndo();

    const charObj = createCharObject(char, activeStyle);
    const newChars = [...chars];
    newChars.splice(cursorPosition, 0, charObj);
    updateActiveDocChars(newChars);
    setCursorPosition(prev => prev + 1);
  }, [activeDoc, chars, cursorPosition, activeStyle, pushUndo, updateActiveDocChars]);

  // Insert a newline
  const insertNewline = useCallback(() => {
    insertChar('\n');
  }, [insertChar]);

  // Delete character before cursor (Backspace)
  const deleteCharBefore = useCallback(() => {
    if (!activeDoc || cursorPosition <= 0) return;
    pushUndo();

    const newChars = [...chars];
    newChars.splice(cursorPosition - 1, 1);
    updateActiveDocChars(newChars);
    setCursorPosition(prev => prev - 1);
  }, [activeDoc, chars, cursorPosition, pushUndo, updateActiveDocChars]);

  // Delete character at cursor (Delete key)
  const deleteCharAt = useCallback(() => {
    if (!activeDoc || cursorPosition >= chars.length) return;
    pushUndo();

    const newChars = [...chars];
    newChars.splice(cursorPosition, 1);
    updateActiveDocChars(newChars);
  }, [activeDoc, chars, cursorPosition, pushUndo, updateActiveDocChars]);

  // Delete word before cursor
  const deleteWordBefore = useCallback(() => {
    if (!activeDoc || cursorPosition <= 0) return;
    pushUndo();

    let pos = cursorPosition - 1;
    // Skip trailing spaces
    while (pos >= 0 && chars[pos].char === ' ') pos--;
    // Delete until next space or start
    while (pos >= 0 && chars[pos].char !== ' ') pos--;
    pos++; // don't delete the space itself

    const newChars = [...chars];
    newChars.splice(pos, cursorPosition - pos);
    updateActiveDocChars(newChars);
    setCursorPosition(pos);
  }, [activeDoc, chars, cursorPosition, pushUndo, updateActiveDocChars]);

  // Clear all text
  const clearAll = useCallback(() => {
    if (!activeDoc) return;
    pushUndo();
    updateActiveDocChars([]);
    setCursorPosition(0);
  }, [activeDoc, pushUndo, updateActiveDocChars]);

  // Undo
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop();
    updateActiveDocChars(prev.chars);
    setCursorPosition(prev.cursorPosition);
  }, [updateActiveDocChars]);

  // Apply style change
  const applyStyleChange = useCallback((styleProp, value) => {
    const newStyle = { ...activeStyle, [styleProp]: value };
    setActiveStyle(newStyle);

    if (styleScope === STYLE_SCOPE.ALL && activeDoc) {
      pushUndo();
      const newChars = chars.map(ch => ({ ...ch, [styleProp]: value }));
      updateActiveDocChars(newChars);
    }
    // If FROM_HERE, we just update activeStyle — new chars inherit it
  }, [activeStyle, styleScope, activeDoc, chars, pushUndo, updateActiveDocChars]);

  // Toggle bold/italic/underline
  const toggleStyleProp = useCallback((prop) => {
    const newValue = !activeStyle[prop];
    applyStyleChange(prop, newValue);
  }, [activeStyle, applyStyleChange]);

  // Find characters/string in the text
  const findInText = useCallback((searchStr) => {
    if (!searchStr || !activeDoc) {
      setFindHighlights([]);
      return [];
    }
    const text = chars.map(c => c.char).join('');
    const highlights = [];
    let idx = text.indexOf(searchStr);
    while (idx !== -1) {
      for (let i = idx; i < idx + searchStr.length; i++) {
        highlights.push(i);
      }
      idx = text.indexOf(searchStr, idx + 1);
    }
    setFindHighlights(highlights);
    return highlights;
  }, [activeDoc, chars]);

  // Replace all occurrences
  const replaceInText = useCallback((searchStr, replaceStr) => {
    if (!searchStr || !activeDoc) return;
    pushUndo();

    const text = chars.map(c => c.char).join('');
    if (!text.includes(searchStr)) return;

    // Rebuild chars array with replacements
    const newChars = [];
    let i = 0;
    while (i < chars.length) {
      const remaining = chars.slice(i).map(c => c.char).join('');
      if (remaining.startsWith(searchStr)) {
        // Insert replacement chars with current active style
        for (const ch of replaceStr) {
          newChars.push(createCharObject(ch, activeStyle));
        }
        i += searchStr.length;
      } else {
        newChars.push({ ...chars[i] });
        i++;
      }
    }

    updateActiveDocChars(newChars);
    setFindHighlights([]);
    setCursorPosition(Math.min(cursorPosition, newChars.length));
  }, [activeDoc, chars, activeStyle, cursorPosition, pushUndo, updateActiveDocChars]);

  // Move cursor
  const moveCursor = useCallback((direction) => {
    setCursorPosition(prev => {
      if (direction === 'left') return Math.max(0, prev - 1);
      if (direction === 'right') return Math.min(chars.length, prev + 1);
      if (direction === 'home') return 0;
      if (direction === 'end') return chars.length;
      return prev;
    });
  }, [chars.length]);

  // Set cursor to specific position
  const setCursorTo = useCallback((pos) => {
    setCursorPosition(Math.max(0, Math.min(pos, chars.length)));
  }, [chars.length]);

  // Toggle language
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'english' ? 'hebrew' : 'english');
  }, []);

  // Toggle keyboard visibility
  const toggleKeyboard = useCallback(() => {
    setShowKeyboard(prev => !prev);
  }, []);

  // Toggle shift
  const toggleShift = useCallback(() => {
    setShiftActive(prev => !prev);
  }, []);

  return {
    // State
    cursorPosition,
    activeStyle,
    styleScope,
    language,
    showKeyboard,
    shiftActive,
    findHighlights,
    chars,

    // Actions
    insertChar,
    insertNewline,
    deleteCharBefore,
    deleteCharAt,
    deleteWordBefore,
    clearAll,
    undo,
    applyStyleChange,
    toggleStyleProp,
    findInText,
    replaceInText,
    moveCursor,
    setCursorTo,
    setStyleScope,
    toggleLanguage,
    toggleKeyboard,
    toggleShift,
    setActiveStyle,
    setCursorPosition,
  };
}
