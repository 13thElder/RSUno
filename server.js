<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VS Code Web IDE - Express Server Edition</title>
    <!-- Load Monaco Editor CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/editor/editor.main.css">
    <style>
        :root {
            --bg-dark: #1e1e1e;
            --bg-sidebar: #181818;
            --bg-activity: #333333;
            --accent-blue: #007acc;
            --accent-blue-hover: #0062a3;
            --text-main: #cccccc;
            --border-color: #2b2b2b;
            --error-red: #f48771;
            --warning-yellow: #cca700;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Top Title Bar */
        .titlebar {
            height: 35px;
            background-color: #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            font-size: 13px;
            border-bottom: 1px solid var(--border-color);
            user-select: none;
        }

        .titlebar .menu-items span {
            margin-right: 15px;
            color: #999;
            cursor: pointer;
        }

        .titlebar .menu-items span:hover {
            color: #fff;
        }

        .actions-btn {
            display: flex;
            gap: 8px;
        }

        button.btn {
            background: var(--accent-blue);
            color: white;
            border: none;
            padding: 4px 12px;
            font-size: 12px;
            border-radius: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: background 0.2s;
        }

        button.btn:hover {
            background: var(--accent-blue-hover);
        }

        button.btn-fix {
            background: #2ea043;
        }
        button.btn-fix:hover {
            background: #238636;
        }

        /* Main Workspace */
        .workspace {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Activity Bar */
        .activity-bar {
            width: 48px;
            background-color: var(--bg-activity);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 10px;
            gap: 18px;
            border-right: 1px solid var(--border-color);
        }

        .activity-icon {
            width: 24px;
            height: 24px;
            fill: #858585;
            cursor: pointer;
        }

        .activity-icon.active {
            fill: #ffffff;
            border-left: 2px solid var(--accent-blue);
            padding-left: 2px;
        }

        /* Sidebar File Explorer */
        .sidebar {
            width: 220px;
            background-color: var(--bg-sidebar);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            font-size: 12px;
        }

        .sidebar-header {
            padding: 10px;
            font-weight: bold;
            letter-spacing: 0.5px;
            color: #bbbbbb;
            text-transform: uppercase;
        }

        .file-tree {
            list-style: none;
        }

        .file-item {
            padding: 6px 15px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            color: #cccccc;
        }

        .file-item.active {
            background-color: #37373d;
            color: #ffffff;
        }

        /* Main Layout (Editor + Terminal/Problems) */
        .main-editor-area {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .tabs-header {
            height: 35px;
            background-color: #252526;
            display: flex;
            border-bottom: 1px solid var(--border-color);
        }

        .tab {
            background: var(--bg-dark);
            padding: 8px 16px;
            font-size: 13px;
            border-right: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 8px;
            color: #fff;
            border-top: 2px solid var(--accent-blue);
        }

        #editor-container {
            flex: 1;
            width: 100%;
        }

        /* Terminal & Diagnostics Panel */
        .bottom-panel {
            height: 220px;
            background-color: #1e1e1e;
            border-top: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
        }

        .panel-nav {
            display: flex;
            background-color: #252526;
            height: 30px;
            align-items: center;
            padding-left: 10px;
            gap: 20px;
            font-size: 12px;
            border-bottom: 1px solid var(--border-color);
        }

        .panel-tab {
            cursor: pointer;
            color: #858585;
            padding: 4px 0;
            text-transform: uppercase;
            font-weight: 600;
        }

        .panel-tab.active {
            color: #ffffff;
            border-bottom: 2px solid var(--accent-blue);
        }

        .panel-body {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
        }

        .problems-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .problem-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 3px 6px;
            border-radius: 3px;
            cursor: pointer;
        }

        .problem-item:hover {
            background-color: #2a2d2e;
        }

        .problem-item.error { color: var(--error-red); }
        .problem-item.warning { color: var(--warning-yellow); }

        .terminal-output {
            color: #00ff66;
            white-space: pre-wrap;
        }

        /* Status Bar */
        .statusbar {
            height: 22px;
            background-color: var(--accent-blue);
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            font-size: 11px;
        }
    </style>
</head>
<body>

    <!-- Titlebar -->
    <div class="titlebar">
        <div class="menu-items">
            <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Help</span>
        </div>
        <div>server.js - Express IDE</div>
        <div class="actions-btn">
            <button class="btn btn-fix" onclick="autoFixCode()">⚡ Auto-Fix Code</button>
            <button class="btn" onclick="runCode()">▶ Run Server</button>
        </div>
    </div>

    <!-- Main Workspace -->
    <div class="workspace">
        <!-- Activity Bar -->
        <div class="activity-bar">
            <svg class="activity-icon active" viewBox="0 0 24 24"><path d="M17.5 0h-9L3 5.5V24h18V5.5L17.5 0zM16 2v4h4l-4-4zM5 22V7h10v15H5z"/></svg>
            <svg class="activity-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">Explorer</div>
            <ul class="file-tree">
                <li class="file-item active">📄 server.js</li>
                <li class="file-item">📄 package.json</li>
                <li class="file-item">📄 .env</li>
            </ul>
        </div>

        <!-- Editor & Panels -->
        <div class="main-editor-area">
            <div class="tabs-header">
                <div class="tab">📄 server.js</div>
            </div>
            
            <!-- Monaco Editor Container -->
            <div id="editor-container"></div>

            <!-- Bottom Panel (Problems & Terminal) -->
            <div class="bottom-panel">
                <div class="panel-nav">
                    <div class="panel-tab active" id="tab-problems" onclick="switchPanel('problems')">Problems (<span id="error-count">0</span>)</div>
                    <div class="panel-tab" id="tab-terminal" onclick="switchPanel('terminal')">Terminal Output</div>
                </div>
                <div class="panel-body">
                    <div id="panel-problems-content" class="problems-list">
                        <div style="color:#888;">No diagnostic issues detected in server.js</div>
                    </div>
                    <div id="panel-terminal-content" class="terminal-output" style="display: none;">
[System] Press "Run Server" to execute your Node.js application...
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Status Bar -->
    <div class="statusbar">
        <div>UTF-8 &nbsp;&nbsp; JavaScript (Node.js)</div>
        <div id="status-diagnostics">✓ Ready</div>
    </div>

    <!-- Monaco Loader -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js"></script>
    <script>
        let editor;

        // Default Code with automatically escaped string template literals
        const initialCode = `const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all incoming cross-origin fetch requests
app.use(cors());
app.use(express.json());

// Catch-all Logger Middleware: Logs EVERY incoming request regardless of path
app.use((req, res, next) => {
    console.log(\`[\${new Date().toISOString()}] \${req.method} request to \${req.originalUrl}\`);
    if (Object.keys(req.query).length > 0) {
        console.log('Query Parameters:', req.query);
    }
    next();
});

// Root Route: https://rsuno-server.onrender.com/
app.get('/', (req, res) => {
    // Checks if a "c" query parameter was sent (e.g. /?c=test)
    if (req.query.c) {
        console.log('>>> Received "c" parameter:', req.query.c);
    }
    res.status(200).send('OK');
});

// Fallback Route: Catches any invalid URLs so you don't get 404s silently
app.use((req, res) => {
    console.log(\`Unmatched route hit: \${req.originalUrl}\`);
    res.status(200).send('OK (Caught by fallback)');
});

// Render dynamically provides process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Node.js server running on port \${PORT}\`);
});`;

        // Require and initialize Monaco Editor
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
            // Register Custom Dark Blue VS Code Theme
            monaco.editor.defineTheme('vs-code-blue-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'keyword', foreground: '569CD6' },
                    { token: 'string', foreground: 'CE9178' },
                    { token: 'number', foreground: 'B5CEA8' },
                    { token: 'identifier', foreground: '9CDCFE' },
                    { token: 'delimiter', foreground: 'D4D4D4' }
                ],
                colors: {
                    'editor.background': '#1e1e1e',
                    'editor.foreground': '#D4D4D4',
                    'editor.lineHighlightBackground': '#2F3339',
                    'editorCursor.foreground': '#007acc',
                    'editorWhitespace.foreground': '#3B3A32',
                    'editorIndentGuide.background': '#404040',
                    'editorIndentGuide.activeBackground': '#707070',
                    'editor.selectionBackground': '#264F78'
                }
            });

            // Configure JavaScript diagnostics/compiler options
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false
            });

            // Create Monaco Instance
            editor = monaco.editor.create(document.getElementById('editor-container'), {
                value: initialCode,
                language: 'javascript',
                theme: 'vs-code-blue-theme',
                automaticLayout: true,
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                renderValidationDecorations: "on"
            });

            // Listen for syntax/error changes
            monaco.editor.onDidChangeMarkers(() => {
                updateDiagnostics();
            });
        });

        // Diagnostics & Error Checking
        function updateDiagnostics() {
            if (!editor) return;
            const model = editor.getModel();
            const markers = monaco.editor.getModelMarkers({ resource: model.uri });
            
            const problemsContainer = document.getElementById('panel-problems-content');
            const errorCount = document.getElementById('error-count');
            const statusDiagnostics = document.getElementById('status-diagnostics');
            
            errorCount.innerText = markers.length;

            if (markers.length === 0) {
                problemsContainer.innerHTML = '<div style="color:#888;">No diagnostic issues detected in server.js</div>';
                statusDiagnostics.innerText = '✓ Ready';
                statusDiagnostics.style.color = '#fff';
            } else {
                problemsContainer.innerHTML = '';
                statusDiagnostics.innerText = `⚠ ${markers.length} Error(s) Detected`;
                statusDiagnostics.style.color = '#ff9999';

                markers.forEach(marker => {
                    const el = document.createElement('div');
                    el.className = `problem-item ${marker.severity === 8 ? 'error' : 'warning'}`;
                    el.innerHTML = `<span>[Line ${marker.startLineNumber}:${marker.startColumn}]</span> <span>${marker.message}</span>`;
                    el.onclick = () => {
                        editor.revealLine(marker.startLineNumber);
                        editor.setPosition({ lineNumber: marker.startLineNumber, column: marker.startColumn });
                        editor.focus();
                    };
                    problemsContainer.appendChild(el);
                });
            }
        }

        // Auto-Fix Code Logic
        function autoFixCode() {
            let currentCode = editor.getValue();
            
            // Fix unescaped dynamic string templates missing backticks (e.g. console.log([${new Date...])
            currentCode = currentCode.replace(/console\.log\(\[(\${.*?})\]\s*(.*?)\);/g, 'console.log(`[$1] $2`);');
            currentCode = currentCode.replace(/console\.log\(Unmatched route hit:\s*(\${.*?})\);/g, 'console.log(`Unmatched route hit: $1`);');
            currentCode = currentCode.replace(/console\.log\(Node\.js server running on port\s*(\${.*?})\);/g, 'console.log(`Node.js server running on port $1`);');

            // Apply auto-fix to Monaco model
            editor.setValue(currentCode);
            switchPanel('terminal');
            appendTerminal('[Auto-Fix AI] Analyzed code syntax. Corrected string template interpolation syntax.');
        }

        // Run Code / Simulate Express Execution
        function runCode() {
            switchPanel('terminal');
            const output = document.getElementById('panel-terminal-content');
            output.innerHTML = ''; // clear terminal
            
            appendTerminal('[System] Compiling server.js...');
            
            const code = editor.getValue();
            
            try {
                // Execute syntax sanity check
                new Function(code);
                
                appendTerminal('[Node.js] Starting Express Application...');
                appendTerminal(`[${new Date().toISOString()}] Node.js server running on port 3000`);
                appendTerminal('[Express] CORS Middleware initialized.');
                appendTerminal('[Express] JSON Body Parser enabled.');
                appendTerminal('--------------------------------------------------');
                appendTerminal('[Simulation Test] GET / request incoming...');
                appendTerminal(`[${new Date().toISOString()}] GET request to /`);
                appendTerminal('[Response 200] OK');
                appendTerminal('[Simulation Test] GET /?c=test query parameter incoming...');
                appendTerminal(`[${new Date().toISOString()}] GET request to /?c=test`);
                appendTerminal('Query Parameters: { c: "test" }');
                appendTerminal('>>> Received "c" parameter: test');
                appendTerminal('[Response 200] OK');
            } catch (err) {
                appendTerminal(`[Runtime Error] Failed to execute code:\n${err.stack}`, '#ff6b6b');
            }
        }

        function appendTerminal(text, color = '#00ff66') {
            const output = document.getElementById('panel-terminal-content');
            const line = document.createElement('div');
            line.style.color = color;
            line.innerText = text;
            output.appendChild(line);
        }

        // UI Panel Toggling
        function switchPanel(panelName) {
            document.getElementById('tab-problems').classList.remove('active');
            document.getElementById('tab-terminal').classList.remove('active');
            
            document.getElementById('panel-problems-content').style.display = 'none';
            document.getElementById('panel-terminal-content').style.display = 'none';

            if (panelName === 'problems') {
                document.getElementById('tab-problems').classList.add('active');
                document.getElementById('panel-problems-content').style.display = 'flex';
            } else {
                document.getElementById('tab-terminal').classList.add('active');
                document.getElementById('panel-terminal-content').style.display = 'block';
            }
        }
    </script>
</body>
</html>
