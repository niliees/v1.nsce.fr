// Funktion zum Auslesen der URL-Parameter
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
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
        // Standardinhalt wenn kein v-Parameter vorhanden ist
        contentDiv.innerHTML = `
            <h1>Willkommen</h1>
            <p>Dies ist die Standardseite.</p>
        `;
    }
}

// Laden Sie den Inhalt wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', loadContent);