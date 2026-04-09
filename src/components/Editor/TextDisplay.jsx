// ייבוא useCallback — הוק שמונע יצירה מחדש של פונקציות בכל רינדור
import { useCallback } from 'react';

// קומפוננטת תצוגת הטקסט — האזור הראשי שבו רואים את הטקסט שמקלידים
// מקבלת:
//   chars — מערך התווים (כל תו = אובייקט עם סטייל משלו)
//   cursorPosition — המיקום הנוכחי של הסמן (מספר)
//   findHighlights — מערך מיקומים של תוצאות חיפוש (מסומנים בצהוב)
//   onClickPosition — פונקציה שנקראת כשלוחצים על מיקום בטקסט (מזיזה את הסמן)
//   language — השפה הנוכחית (english/hebrew) — קובעת כיוון טקסט
export default function TextDisplay({ chars, cursorPosition, findHighlights, onClickPosition, language }) {

  // טיפול בלחיצה על הטקסט — מחשב לאיזה תו לחצו ומזיז את הסמן לשם
  const handleClick = useCallback((e) => {
    // מחפש את ה-data-index של האלמנט שנלחץ (כל תו מקבל אינדקס)
    const target = e.target;
    const index = target.getAttribute('data-index');
    if (index !== null) {
      // לחצו על תו מסוים — הסמן ייקפוץ ממש אחריו (+1)
      onClickPosition(parseInt(index, 10) + 1);
    } else {
      // לחצו על שטח ריק — הסמן יעבור לסוף הטקסט
      onClickPosition(chars.length);
    }
  }, [chars.length, onClickPosition]);

  // בדיקה אם השפה עברית — אם כן, הטקסט יוצג מימין לשמאל (RTL)
  const isRtl = language === 'hebrew';

  // פונקציה שבונה את כל אלמנטי הטקסט — עוברת על כל תו ויוצרת span עם הסטייל שלו
  const renderChars = () => {
    const elements = [];

    // לולאה על כל התווים + מיקום אחד נוסף (עבור הסמן בסוף)
    for (let i = 0; i <= chars.length; i++) {

      // אם הסמן נמצא במיקום הזה — מציג את הסמן המהבהב
      if (i === cursorPosition) {
        elements.push(
          <span key="cursor" className="cursor-blink" />
        );
      }

      // מציג את התו עצמו (אם יש תו במיקום הזה)
      if (i < chars.length) {
        const ch = chars[i];
        // בודק אם התו הזה נמצא בתוצאות החיפוש (צריך להדגיש אותו)
        const isHighlighted = findHighlights.includes(i);

        // בניית אובייקט הסטייל מתוך המאפיינים של התו
        // כל תו שומר את הצבע, הגודל, גופן, מודגש, נטוי, וקו תחתון שלו
        const style = {
          color: ch.color,
          fontSize: ch.fontSize,
          fontFamily: ch.fontFamily,
          fontWeight: ch.bold ? 'bold' : 'normal',
          fontStyle: ch.italic ? 'italic' : 'normal',
          textDecoration: ch.underline ? 'underline' : 'none',
        };

        // אם התו הוא ירידת שורה (\n) — מציג אותו כ-span עם שורה חדשה
        if (ch.char === '\n') {
          elements.push(
            <span key={ch.id} data-index={i} className={`char-span ${isHighlighted ? 'highlighted' : ''}`} style={style}>
              {'\n'}
            </span>
          );
        } else {
          // תו רגיל — מציג אותו עם הסטייל המתאים
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

  // ============================================
  // הרינדור — האזור שרואים על המסך
  // ============================================
  return (
    <div
      className={`text-display ${isRtl ? 'rtl' : ''}`}
      onClick={handleClick}
      tabIndex={0}
      id="text-display"
    >
      {/* מצב ריק — כשאין תווים בכלל, מציג סמן מהבהב + טקסט placeholder */}
      {chars.length === 0 && cursorPosition === 0 && (
        <>
          <span className="cursor-blink" />
          <span style={{ color: 'var(--text-muted)', pointerEvents: 'none' }}>
            Start typing...
          </span>
        </>
      )}

      {/* מצב רגיל — יש תווים, מציג אותם דרך renderChars */}
      {chars.length > 0 && renderChars()}
    </div>
  );
}
