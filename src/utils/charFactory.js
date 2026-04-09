/**
 * ==============================================
 * charFactory.js — מפעל התווים והמסמכים
 * ==============================================
 * קובץ עזר שאחראי על יצירת האובייקטים הבסיסיים של האפליקציה:
 *
 * 1. generateId() — יצירת מזהה ייחודי לכל תו (כדי שריאקט יוכל לעקוב אחרי כל span)
 * 2. generateDocId() — יצירת מזהה ייחודי לכל מסמך
 * 3. DEFAULT_STYLE — הסטייל ברירת המחדל של תו חדש (צבע לבן, Arial, 18px, לא מודגש)
 * 4. createCharObject(char, style) — יוצר אובייקט תו בודד עם כל המאפיינים שלו
 *    (צבע, גודל, גופן, bold, italic, underline)
 * 5. createDocument(owner, name) — יוצר אובייקט מסמך חדש ריק עם בעלים ושם
 *
 * זהו הליבה של מערכת העיצוב — כל תו שמוקלד עובר דרך createCharObject
 * ומקבל את הסטייל הפעיל באותו רגע.
 */

let idCounter = Date.now();

export function generateId() {
  return `ch_${idCounter++}_${Math.random().toString(36).substring(2, 6)}`;
}

export function generateDocId() {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export const DEFAULT_STYLE = {
  color: '#e8e8f0',
  fontSize: '18px',
  fontFamily: 'Arial',
  bold: false,
  italic: false,
  underline: false,
};

export function createCharObject(char, style = DEFAULT_STYLE) {
  return {
    id: generateId(),
    char,
    color: style.color || DEFAULT_STYLE.color,
    fontSize: style.fontSize || DEFAULT_STYLE.fontSize,
    fontFamily: style.fontFamily || DEFAULT_STYLE.fontFamily,
    bold: style.bold || false,
    italic: style.italic || false,
    underline: style.underline || false,
  };
}

export function createDocument(owner, name = 'Untitled') {
  return {
    id: generateDocId(),
    name,
    owner,
    chars: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    savedAt: null,
  };
}
