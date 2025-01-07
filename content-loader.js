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

// Funktion zur Validierung der Edit-ID
function validateEditId(editId) {
    // Prüft ob die Edit-ID mit 'vei' beginnt und danach nur Zahlen enthält
    // Die Gesamtlänge sollte 12 Zeichen sein (3 für 'vei' + 9 Zahlen)
    return /^vei\d{9}$/.test(editId);
}

// Funktion zum Weiterleiten mit Code und optional Edit-ID
function redirectWithParameters(code, editId = null) {
    const currentUrl = window.location.origin + window.location.pathname;
    let url = `${currentUrl}?v=${code}`;
    if (editId) {
        url += `&edit-id=${editId}`;
    }
    window.location.href = url;
}

// Funktion zum Überprüfen und Ausführen von Weiterleitungen
function checkAndRedirect() {
    const params = getUrlParameters();
    
    // Überprüfen ob der short Parameter existiert und true ist
    if (params.short === 'true') {
        const targetUrl = 'w.nsce.fr'; // Die Ziel-URL für die Weiterleitung
        window.location.href = `https://${targetUrl}`;
        return true;
    }
    return false;
}

// Funktion zum Laden verschiedener Inhalte basierend auf den Parametern
async function loadContent() {
    // Zuerst prüfen ob eine Weiterleitung erforderlich ist
    if (checkAndRedirect()) {
        return; // Wenn eine Weiterleitung stattfindet, brechen wir hier ab
    }

    const params = getUrlParameters();
    const contentDiv = document.getElementById('content');
    
    // Prüfen ob der v-Parameter existiert
    if (params.v) {
        try {
            let fileName = params.v;
            // Wenn eine Edit-ID vorhanden ist, lade die Edit-Version
            if (params['edit-id'] && validateEditId(params['edit-id'])) {
                fileName += `-edit`;
            }
            
            // Versuche die entsprechende HTML-Datei zu laden
            const response = await fetch(`${fileName}.html`);
            if (response.ok) {
                const content = await response.text();
                contentDiv.innerHTML = content;
                return;
            }
            
            throw new Error('Inhalt nicht gefunden');
        } catch (error) {
            console.error('Fehler beim Laden des Inhalts:', error);
            contentDiv.innerHTML = '<p>Fehler beim Laden des Inhalts.</p>';
        }
    } else {
        // Standardinhalt mit Eingabefeldern
        contentDiv.innerHTML = `
            <div class="container" style="padding: 20px; max-width: 800px; margin: 0 auto;">
                <h1>Code Eingeben</h1>                
                <div class="code-input-container" style="margin-top: 20px;">
                    <input type="text" 
                           id="codeInput" 
                           maxlength="4" 
                           placeholder="1a2b"
                           style="padding: 8px; font-size: 16px; width: 200px; margin-right: 10px;">
                    <input type="text" 
                           id="editIdInput" 
                           maxlength="12" 
                           placeholder="Edit-ID (optional)"
                           style="padding: 8px; font-size: 16px; width: 200px; margin-right: 10px;">
                    <button onclick="handleSubmit()" 
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
                handleSubmit();
            }
        });
        document.getElementById('editIdInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });
    }
}

// Funktion zum Behandeln der Eingabe
function handleSubmit() {
    const codeInput = document.getElementById('codeInput');
    const editIdInput = document.getElementById('editIdInput');
    const errorMessage = document.getElementById('errorMessage');
    
    const code = codeInput.value.trim();
    const editId = editIdInput.value.trim();
    
    if (!validateCode(code)) {
        errorMessage.textContent = 'Bitte geben Sie einen gültigen 4-stelligen Code ein (Buchstaben und Zahlen)';
        return;
    }
    
    if (editId && !validateEditId(editId)) {
        errorMessage.textContent = 'Die Edit-ID muss mit "vei" beginnen und danach 9 Zahlen enthalten';
        return;
    }
    
    errorMessage.textContent = '';
    redirectWithParameters(code, editId || null);
}

// Laden Sie den Inhalt wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log('Seite geladen, führe loadContent aus');
    loadContent();
});