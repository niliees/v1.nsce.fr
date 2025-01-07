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
            <!DOCTYPE html>
            <html lang="de">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>nsce.fr</title>
            <link href="https://cdn.nsce.fr/main.css" rel="stylesheet">
            <body>
            <div class="container">
            <h1>nsce.fr</h1>
            <p>v1.nsce.fr ist ein Projekt der <a href="https://nsce.fr">NSCE</a></p>
            </div>
            </body>
            </html>
        `;
    }
}

// Laden Sie den Inhalt wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', loadContent);