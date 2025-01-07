// Funktion zum Auslesen der URL-Parameter
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Funktion zur Validierung des Codes
function validateCode(code) {
    // Prüft ob der Code 4 Zeichen lang ist und nur Buchstaben und Zahlen enthält
    return /^[a-zA-Z0-9]{4}$/.test(code);
}

// Funktion zum Weiterleiten mit Code
function redirectWithCode(code) {
    const currentUrl = window.location.origin + window.location.pathname;
    window.location.href = `${currentUrl}?v=${code}`;
}

// Funktion zum Laden verschiedener Inhalte basierend auf dem v-Parameter
async function loadContent() {
    const params = getUrlParameters();
    const contentDiv = document.getElementById('content');
    
    // Prüfen ob der v-Parameter existiert
    if (params.v) {
        try {
            // Option 1: Laden einer anderen HTML-Datei
            const response = await fetch(`${params.v}.html`);
            if (response.ok) {
                const content = await response.text();
                contentDiv.innerHTML = content;
                return;
            }
            
        } catch (error) {
            console.error('Fehler beim Laden des Inhalts:', error);
            contentDiv.innerHTML = '<p>Fehler beim Laden des Inhalts.</p>';
        }
    } else {
        // Standardinhalt mit Eingabefeld
        contentDiv.innerHTML = `
            <div class="container" style="padding: 20px; max-width: 800px; margin: 0 auto;">
                <h1>Code Eingeben</h1>                
                <div class="code-input-container" style="margin-top: 20px;">
                    <input type="text" 
                           id="codeInput" 
                           maxlength="4" 
                           placeholder="1a2b"
                           style="padding: 8px; font-size: 16px; width: 200px; margin-right: 10px;">
                    <button onclick="handleCodeSubmit()" 
                            style="padding: 8px 16px; font-size: 16px; cursor: pointer;">
                        Öffnen
                    </button>
                    <p id="errorMessage" style="color: red; margin-top: 10px;"></p>
                </div>
            </div>
        `;

        // Event-Listener für Enter-Taste
        document.getElementById('codeInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleCodeSubmit();
            }
        });
    }
}

// Funktion zum Behandeln der Code-Eingabe
function handleCodeSubmit() {
    const codeInput = document.getElementById('codeInput');
    const errorMessage = document.getElementById('errorMessage');
    const code = codeInput.value.trim();
    
    if (validateCode(code)) {
        errorMessage.textContent = '';
        redirectWithCode(code);
    } else {
        errorMessage.textContent = 'Bitte geben Sie einen gültigen 4-stelligen Code ein (Buchstaben und Zahlen)';
    }
}

// Laden Sie den Inhalt wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log('Seite geladen, führe loadContent aus');
    loadContent();
});