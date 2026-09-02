<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online C++ Compiler</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
//w
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f1a;
            color: #cdd6f4;
            min-height: 100vh;
            padding: 20px;
        }

        .compiler-container {
            max-width: 1200px;
            margin: 0 auto;
            background: #1e1e2e;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #313244;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #11111b;
            border-bottom: 1px solid #313244;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo .icon {
            font-size: 22px;
        }

        .logo .title {
            font-size: 18px;
            font-weight: 600;
            color: #cdd6f4;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .btn-primary {
            background: #89b4fa;
            color: #11111b;
        }

        .btn-primary:hover {
            background: #b4befe;
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: #313244;
            color: #cdd6f4;
        }

        .btn-secondary:hover {
            background: #45475a;
        }

        .editor-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 450px;
        }

        @media (max-width: 768px) {
            .editor-wrapper {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
            }
        }

        .panel {
            display: flex;
            flex-direction: column;
            border-right: 1px solid #313244;
        }

        .panel:last-child {
            border-right: none;
        }

        @media (max-width: 768px) {
            .panel {
                border-right: none;
                border-bottom: 1px solid #313244;
            }
            .panel:last-child {
                border-bottom: none;
            }
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            background: #11111b;
            border-bottom: 1px solid #313244;
        }

        .panel-title {
            font-size: 13px;
            font-weight: 500;
            color: #cdd6f4;
        }

        .lang-badge {
            font-size: 11px;
            padding: 3px 10px;
            background: #89b4fa;
            color: #11111b;
            border-radius: 4px;
            font-weight: 600;
        }

        .clear-output {
            font-size: 12px;
            padding: 4px 10px;
            background: transparent;
            border: 1px solid #45475a;
            color: #6c7086;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .clear-output:hover {
            border-color: #6c7086;
            color: #cdd6f4;
        }

        .code-input {
            flex: 1;
            width: 100%;
            padding: 16px;
            border: none;
            outline: none;
            resize: none;
            font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 14px;
            line-height: 1.7;
            background: #1e1e2e;
            color: #cdd6f4;
            tab-size: 4;
        }

        .code-input::placeholder {
            color: #6c7086;
        }

        .output-content {
            flex: 1;
            padding: 16px;
            background: #11111b;
            font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Consolas, monospace;
            font-size: 13px;
            line-height: 1.6;
            overflow-y: auto;
            color: #cdd6f4;
            max-height: 450px;
        }

        .placeholder {
            color: #6c7086;
            font-style: italic;
        }

        .output-line {
            margin: 3px 0;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .output-line.stdout {
            color: #cdd6f4;
        }

        .output-line.stderr {
            color: #f38ba8;
        }

        .output-line.info {
            color: #a6e3a1;
        }

        .output-line.error {
            color: #f38ba8;
            font-weight: 500;
        }

        .status-bar {
            display: flex;
            justify-content: space-between;
            padding: 8px 16px;
            background: #11111b;
            border-top: 1px solid #313244;
            font-size: 12px;
            color: #6c7086;
        }

        .spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #313244;
            border-top-color: #89b4fa;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .success-icon {
            color: #a6e3a1;
            margin-right: 6px;
        }

        .error-icon {
            color: #f38ba8;
            margin-right: 6px;
        }
    </style>
</head>
<body>
    <div class="compiler-container">
        <div class="toolbar">
            <div class="logo">
                <span class="icon">⚡</span>
                <span class="title">CPP Compiler</span>
            </div>
            <div class="actions">
                <button class="btn btn-secondary" onclick="clearCode()">Clear</button>
                <button class="btn btn-primary" onclick="runCode()">
                    <span>▶</span> Run
                </button>
            </div>
        </div>
        
        <div class="editor-wrapper">
            <div class="panel code-panel">
                <div class="panel-header">
                    <span class="panel-title">main.cpp</span>
                    <span class="lang-badge">C++17</span>
                </div>
                <textarea id="codeEditor" class="code-input" spellcheck="false" placeholder="// Write your C++ code here...">#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}</textarea>
            </div>
            
            <div class="panel output-panel">
                <div class="panel-header">
                    <span class="panel-title">Output</span>
                    <button class="clear-output" onclick="clearOutput()">Clear</button>
                </div>
                <div id="output" class="output-content">
                    <div class="placeholder">Click "Run" to compile and execute your code...</div>
                </div>
            </div>
        </div>
        
        <div class="status-bar">
            <span id="status">Ready</span>
            <span id="cursorPos">Ln 1, Col 1</span>
        </div>
    </div>

    <script>
        const editor = document.getElementById('codeEditor');
        const output = document.getElementById('output');
        const status = document.getElementById('status');
        const cursorPos = document.getElementById('cursorPos');

        // Track cursor position
        editor.addEventListener('keyup', updateCursorPos);
        editor.addEventListener('click', updateCursorPos);

        function updateCursorPos() {
            const text = editor.value.substring(0, editor.selectionStart);
            const lines = text.split('\n');
            const line = lines.length;
            const col = lines[lines.length - 1].length + 1;
            cursorPos.textContent = `Ln ${line}, Col ${col}`;
        }

        // Tab support (4 spaces)
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
                updateCursorPos();
            }
        });

        function clearCode() {
            editor.value = '';
            updateCursorPos();
        }

        function clearOutput() {
            output.innerHTML = '<div class="placeholder">Click "Run" to compile and execute your code...</div>';
        }

        function appendLine(text, className = 'stdout') {
            const line = document.createElement('div');
            line.className = `output-line ${className}`;
            line.textContent = text;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }

        function runCode() {
            const code = editor.value.trim();
            if (!code) {
                output.innerHTML = '';
                appendLine('Error: No code to compile', 'error');
                return;
            }
            
            output.innerHTML = '';
            status.innerHTML = '<span class="spinner"></span> Compiling...';
            
            // Simulate compilation delay
            setTimeout(() => {
                const result = simulateCompile(code);
                status.innerHTML = result.success 
                    ? '<span class="success-icon">✓</span> Finished' 
                    : '<span class="error-icon">✗</span> Error';
                
                if (result.messages.length > 0) {
                    result.messages.forEach(msg => appendLine(msg.text, msg.type));
                }
                
                if (result.success && result.output) {
                    result.output.split('\n').forEach(line => {
                        if (line.trim()) appendLine(line, 'stdout');
                    });
                }
            }, 800 + Math.random() * 600);
        }

        function simulateCompile(code) {
            // Simple simulation of C++ compilation
            const hasMain = code.includes('int main');
            const hasInclude = code.includes('#include');
            const hasCout = code.includes('cout') || code.includes('printf');
            
            if (!hasMain) {
                return {
                    success: false,
                    messages: [
                        { text: '/usr/bin/ld: /tmp/ccxyz.o: in function `_start\':', type: 'stderr' },
                        { text: '(.text+0x20): undefined reference to `main\'', type: 'stderr' },
                        { text: 'collect2: error returned 1 exit status', type: 'stderr' }
                    ]
                };
            }
            
            // Extract cout content
            let programOutput = '';
            const coutMatch = code.match(/cout\s*<<\s*["']([^"']+)["']/);
            const printfMatch = code.match(/printf\s*\(\s*["']([^"']+)["']/);
            const endlMatch = code.includes('endl') || code.includes('\\n');
            
            if (coutMatch) programOutput = coutMatch[1];
            else if (printfMatch) programOutput = printfMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            else programOutput = 'Program executed successfully.';
            
            // Simulate compilation warnings/messages
            const messages = [];
            messages.push({ text: '> g++ -std=c++17 -Wall -o main main.cpp', type: 'info' });
            
            if (hasCout && !code.includes('iostream') && !code.includes('cstdio')) {
                messages.push({ text: 'warning: implicit declaration of function \'printf\'', type: 'stderr' });
            }
            
            messages.push({ text: '> ./main', type: 'info' });
            
            return {
                success: true,
                messages: messages,
                output: programOutput
            };
        }

        // Initialize
        updateCursorPos();
    </script>
</body>
</html>
