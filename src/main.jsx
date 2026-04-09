/**
 * ==============================================
 * main.jsx — נקודת הכניסה של האפליקציה
 * ==============================================
 * זהו הקובץ הראשון שרץ כשהאפליקציה נטענת בדפדפן.
 * תפקידו: לחבר את קומפוננטת App הראשית לאלמנט ה-HTML שנמצא בקובץ index.html (div עם id="root").
 * React.StrictMode עוטף את האפליקציה ומפעיל בדיקות נוספות בזמן פיתוח (לא משפיע בפרודקשן).
 * כולל גם ייבוא של גיליון העיצוב הגלובלי (index.css) שמגדיר את המשתנים והסטיילינג הבסיסי.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
