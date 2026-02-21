/*
 * WBT Companion - Login Handler
 */

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Verhindert, dass die Seite neu lädt

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const submitBtn = document.querySelector('button[type="submit"]');

    // Lade-Animation im Button
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Authentifizierung...";
    submitBtn.classList.add('opacity-70', 'cursor-wait');
    errorMsg.classList.add('hidden');

    try {
        // Wir schicken Benutzer und Passwort an unseren Node-Server
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const data = await response.json();

        if (response.ok) {
            // Login war erfolgreich! Der Server hat uns heimlich das httpOnly-Cookie gesetzt.
            submitBtn.innerHTML = "✓ Erfolgreich";
            submitBtn.classList.replace('bg-blue-600', 'bg-green-500');
            
            // Wir leiten den Nutzer ins gelobte Land weiter
            setTimeout(() => {
                window.location.href = '/pages/explore.html';
            }, 500);
        } else {
            // Falsches Passwort oder Benutzername
            errorMsg.innerText = data.error || "Ein Fehler ist aufgetreten.";
            errorMsg.classList.remove('hidden');
            resetButton();
        }
    } catch (err) {
        errorMsg.innerText = "Server nicht erreichbar.";
        errorMsg.classList.remove('hidden');
        resetButton();
    }

    function resetButton() {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.classList.remove('opacity-70', 'cursor-wait');
    }
});