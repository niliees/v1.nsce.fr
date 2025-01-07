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
    return /^vei\d{9}$/.test(editId);
}

// Funktion zum Weiterleiten mit Code und Parametern
function redirectWithParameters(code, editId = null, view = null, theme = null, version = null, preview = null, print = null, embed = null) {
    const currentUrl = window.location.origin + window.location.pathname;
    let url = `${currentUrl}?v=${code}`;
    
    if (editId) url += `&edit-id=${editId}`;
    if (view) url += `&view=${view}`;
    if (theme) url += `&theme=${theme}`;
    if (version) url += `&version=${version}`;
    if (preview === true) url += `&preview=true`;
    if (print === true) url += `&print=true`;
    if (embed === true) url += `&embed=true`;
    
    window.location.href = url;
}

// Funktion zum Überprüfen und Ausführen von Weiterleitungen
function checkAndRedirect() {
    const params = getUrlParameters();
    
    if (params.short === 'true') {
        const targetUrl = 'w.nsce.fr';
        window.location.href = `https://${targetUrl}`;
        return true;
    }
    return false;
}

// Funktion zum Anwenden des Themes
function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.style.backgroundColor = '#1a1a1a';
        body.style.color = '#ffffff';
    } else {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#000000';
    }
}

// Funktion zum Anwenden der Ansicht
function applyView(view) {
    const contentDiv = document.getElementById('content');
    if (view === 'compact') {
        contentDiv.style.maxWidth = '600px';
        contentDiv.style.fontSize = '0.9em';
    } else {
        contentDiv.style.maxWidth = '800px';
        contentDiv.style.fontSize = '1em';
    }
}

// Funktion zum Erstellen der Print-Version
function createPrintVersion() {
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
        @media print {
            body { background: white; }
            #content { max-width: 100% !important; }
            .no-print { display: none !important; }
        }
    `;
    document.head.appendChild(printStyles);
}

// Funktion zum Erstellen der Embed-Version
function createEmbedVersion() {
    const content = document.getElementById('content');
    content.style.padding = '0';
    content.style.margin = '0';
    content.style.border = 'none';
    // Entferne Navigation und Footer falls vorhanden
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
}

// Funktion zum Laden verschiedener Inhalte basierend auf den Parametern
async function loadContent() {
    if (checkAndRedirect()) return;

    const params = getUrlParameters();
    const contentDiv = document.getElementById('content');
    
    // Anwenden der verschiedenen Parameter
    if (params.theme) applyTheme(params.theme);
    if (params.view) applyView(params.view);
    if (params.print === 'true') createPrintVersion();
    if (params.embed === 'true') createEmbedVersion();
    
    // Version Header hinzufügen wenn vorhanden
    if (params.version) {
        const versionHeader = document.createElement('div');
        versionHeader.innerHTML = `Version: ${params.version}`;
        versionHeader.style.padding = '5px';
        versionHeader.style.backgroundColor = '#f0f0f0';
        versionHeader.style.marginBottom = '10px';
        document.body.insertBefore(versionHeader, document.body.firstChild);
    }
    
    // Preview Banner hinzufügen wenn aktiv
    if (params.preview === 'true') {
        const previewBanner = document.createElement('div');
        previewBanner.innerHTML = 'VORSCHAU-MODUS';
        previewBanner.style.backgroundColor = '#ffeb3b';
        previewBanner.style.padding = '10px';
        previewBanner.style.textAlign = 'center';
        previewBanner.style.position = 'sticky';
        previewBanner.style.top = '0';
        document.body.insertBefore(previewBanner, document.body.firstChild);
    }

    if (params.v) {
        try {
            let fileName = params.v;
            if (params['edit-id'] && validateEditId(params['edit-id'])) {
                fileName += `-edit`;
            }
            
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
        // Erweiterte Eingabemaske mit zusätzlichen Optionen
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
                    
                    <div style="margin-top: 20px;">
                        <select id="viewSelect" style="padding: 8px; margin-right: 10px;">
                            <option value="">Standard Ansicht</option>
                            <option value="compact">Kompakte Ansicht</option>
                            <option value="full">Volle Ansicht</option>
                        </select>
                        
                        <select id="themeSelect" style="padding: 8px; margin-right: 10px;">
                            <option value="">Standard Theme</option>
                            <option value="light">Hell</option>
                            <option value="dark">Dunkel</option>
                        </select>
                        
                        <input type="text" 
                               id="versionInput" 
                               placeholder="Version (optional)"
                               style="padding: 8px; width: 150px; margin-right: 10px;">
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <label style="margin-right: 15px;">
                            <input type="checkbox" id="previewCheck"> Vorschau
                        </label>
                        <label style="margin-right: 15px;">
                            <input type="checkbox" id="printCheck"> Druckversion
                        </label>
                        <label>
                            <input type="checkbox" id="embedCheck"> Eingebettete Version
                        </label>
                    </div>

                    <button onclick="handleSubmit()" 
                            style="padding: 8px 16px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                        Öffnen
                    </button>
                    <p id="errorMessage" style="color: red; margin-top: 10px;"></p>
                </div>
            </div>
        `;

        // Event-Listener für Enter-Taste
        document.getElementById('codeInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSubmit();
        });
        document.getElementById('editIdInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSubmit();
        });
    }
}

// Erweiterte Funktion zum Behandeln der Eingabe
function handleSubmit() {
    const codeInput = document.getElementById('codeInput');
    const editIdInput = document.getElementById('editIdInput');
    const viewSelect = document.getElementById('viewSelect');
    const themeSelect = document.getElementById('themeSelect');
    const versionInput = document.getElementById('versionInput');
    const previewCheck = document.getElementById('previewCheck');
    const printCheck = document.getElementById('printCheck');
    const embedCheck = document.getElementById('embedCheck');
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
    redirectWithParameters(
        code,
        editId || null,
        viewSelect.value || null,
        themeSelect.value || null,
        versionInput.value || null,
        previewCheck.checked,
        printCheck.checked,
        embedCheck.checked
    );
}

// Laden Sie den Inhalt wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log('Seite geladen, führe loadContent aus');
    loadContent();
});