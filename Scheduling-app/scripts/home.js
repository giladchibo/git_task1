        // בדיקה אם המשתמש מחובר בעת טעינת הדף
        document.addEventListener('DOMContentLoaded', () => {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                // אם אין משתמש מחובר, הפניה לדף ההתחברות
                window.location.href = '../pages/register-login.html';
            }

            // טיפול בהתנתקות
            document.getElementById('logout').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser'); // מחיקת המשתמש הנוכחי
                window.location.href = '../pages/register-login.html'; // הפניה לדף ההתחברות
            });
        });