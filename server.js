const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Parse raw body for file uploads
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    let data = Buffer.alloc(0);
    req.on('data', chunk => data = Buffer.concat([data, chunk]));
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Simple file upload without multer
app.post('/upload', (req, res) => {
  if (!req.rawBody) {
    return res.status(400).json({ error: 'No file data' });
  }
  
  // Extract filename from Content-Disposition header
  const contentDisp = req.headers['content-disposition'] || '';
  const filenameMatch = contentDisp.match(/filename="(.+)"/);
  const originalName = filenameMatch ? filenameMatch[1] : `file-${Date.now()}`;
  const filename = `${Date.now()}-${originalName}`;
  const filepath = path.join(uploadDir, filename);
  
  fs.writeFileSync(filepath, req.rawBody);
  
  res.json({
    success: true,
    file: {
      originalName: originalName,
      filename: filename,
      size: req.rawBody.length,
      url: `${req.protocol}://${req.get('host')}/${filename}`
    }
  });
});

// List files
app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Unable to read files' });
    
    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join(uploadDir, filename));
      return {
        filename: filename,
        originalName: filename.substring(filename.indexOf('-') + 1),
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `${req.protocol}://${req.get('host')}/${filename}`
      };
    });
    
    res.json({ count: fileList.length, files: fileList });
  });
});

// Download file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  if (!filepath.startsWith(path.join(__dirname, 'uploads'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.sendFile(filepath);
});

// Delete file
app.delete('/delete/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename);
  
  if (!filepath.startsWith(path.join(__dirname, 'uploads'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  fs.unlinkSync(filepath);
  res.json({ success: true });
});

// Simple web interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>File Host</title>
      <style>
        body { font-family: sans-serif; background: #1a1a2e; color: #eee; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #00d9ff; }
        .upload-box { border: 2px dashed #444; padding: 40px; text-align: center; border-radius: 10px; margin: 20px 0; }
        button { background: #00d9ff; color: #000; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        button:hover { background: #33e5ff; }
        input[type="file"] { display: none; }
        .file { background: #16213e; padding: 15px; margin: 10px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .file a { color: #00d9ff; text-decoration: none; }
        .delete { background: #ff4444; color: white; padding: 6px 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>📁 File Host</h1>
      <div class="upload-box">
        <p>Select files to upload</p>
        <input type="file" id="fileInput" multiple>
        <button onclick="document.getElementById('fileInput').click()">Choose Files</button>
      </div>
      <div id="files"></div>
      
      <script>
        document.getElementById('fileInput').addEventListener('change', async (e) => {
          for (let file of e.target.files) {
            const formData = new FormData();
            formData.append('file', file);
            await fetch('/upload', { method: 'POST', body: formData });
          }
          loadFiles();
        });
        
        async function loadFiles() {
          const res = await fetch('/files');
          const data = await res.json();
          const div = document.getElementById('files');
          div.innerHTML = '<h2>Files:</h2>' + data.files.map(f => 
            '<div class="file">' +
              '<span>' + f.originalName + '</span>' +
              '<div>' +
                '<a href="/' + f.filename + '">Download</a> ' +
                '<button class="delete" onclick="del(\\'' + f.filename + '\\')">Delete</button>' +
              '</div>' +
            '</div>'
          ).join('');
        }
        
        async function del(filename) {
          await fetch('/delete/' + filename, { method: 'DELETE' });
          loadFiles();
        }
        
        loadFiles();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`📁 File Host running on port ${PORT}`);
});
