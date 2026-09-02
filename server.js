const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Upload single file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `${req.protocol}://${req.get('host')}/download/${req.file.filename}`;
  
  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    }
  });
});

// Upload multiple files
app.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  const files = req.files.map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    url: `${req.protocol}://${req.get('host')}/download/${file.filename}`
  }));
  
  res.json({
    success: true,
    files: files
  });
});

// List all files
app.get('/files', (req, res) => {
  const uploadDir = './uploads';
  
  if (!fs.existsSync(uploadDir)) {
    return res.json({ files: [], count: 0 });
  }
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read files' });
    }
    
    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join(uploadDir, filename));
      return {
        filename: filename,
        originalName: filename.substring(filename.indexOf('-') + 1),
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `${req.protocol}://${req.get('host')}/download/${filename}`
      };
    });
    
    res.json({
      count: fileList.length,
      files: fileList.sort((a, b) => b.uploadedAt - a.uploadedAt)
    });
  });
});

// Download file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname, 'uploads'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filePath, filename.substring(filename.indexOf('-') + 1));
});

// Delete file
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (!filePath.startsWith(path.join(__dirname, 'uploads'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  fs.unlinkSync(filePath);
  res.json({ success: true, message: 'File deleted' });
});

// Web interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>📁 File Host</title>
      <style>
        body { font-family: sans-serif; background: #0f1419; color: #e6edf3; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #58a6ff; }
        .upload-area {
          border: 2px dashed #30363d;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          background: #161b22;
          margin: 20px 0;
        }
        .btn {
          background: #238636;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn:hover { background: #2ea043; }
        input[type="file"] { display: none; }
        .file-list { margin-top: 20px; }
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .file-info { flex: 1; }
        .file-btn {
          background: #21262d;
          border: 1px solid #30363d;
          color: #e6edf3;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📁 File Host</h1>
        <div class="upload-area">
          <p>Click to upload files</p>
          <input type="file" id="fileInput" multiple>
          <button class="btn" onclick="document.getElementById('fileInput').click()">Choose Files</button>
        </div>
        <div id="fileList"></div>
      </div>
      <script>
        document.getElementById('fileInput').addEventListener('change', async (e) => {
          const files = e.target.files;
          if (!files.length) return;
          
          const formData = new FormData();
          for (let file of files) {
            formData.append('files', file);
          }
          
          await fetch('/upload-multiple', { method: 'POST', body: formData });
          loadFiles();
        });
        
        async function loadFiles() {
          const res = await fetch('/files');
          const data = await res.json();
          const list = document.getElementById('fileList');
          
          if (data.files.length === 0) {
            list.innerHTML = '<p>No files uploaded</p>';
            return;
          }
          
          list.innerHTML = '<h2>Uploaded Files:</h2>' + data.files.map(f => 
            '<div class="file-item">' +
              '<div class="file-info">' + f.originalName + '</div>' +
              '<a class="file-btn" href="/download/' + f.filename + '">Download</a>' +
              '<button class="file-btn" onclick="deleteFile(\\'' + f.filename + '\\')">Delete</button>' +
            '</div>'
          ).join('');
        }
        
        async function deleteFile(filename) {
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
