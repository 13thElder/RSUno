const express = require('express');
const cors = require('cors');
const app = express();

// ============================================
// ⚠️ EDUCATIONAL XSS TEST ENVIRONMENT ONLY ⚠️
// This is for learning about XSS vulnerabilities
// in a controlled, isolated environment
// NEVER use this pattern in production!
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve test files

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ============================================
// 🎯 XSS RECEIVER ENDPOINT (Educational)
// This demonstrates how attackers exfiltrate data
// Use this to understand what to defend against
// ============================================
app.get('/xss-test-receiver', (req, res) => {
    // Only allow in development/testing
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).send('Not allowed in production');
    }

    const { cookies, url, timestamp } = req.query;
    
    if (cookies) {
        console.log('\n🔴 XSS PAYLOAD EXECUTED!');
        console.log('📍 Source:', url || 'unknown');
        console.log('🍪 Exfiltrated data:', cookies);
        console.log('⏰ Time:', timestamp || new Date().toISOString());
        console.log('-------------------------------------------\n');
        
        // In a real attack, this would save to a database
        // For education, we just log it
    }
    
    // Return 1x1 pixel (common in tracking/XSS)
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.set('Content-Type', 'image/gif');
    res.send(pixel);
});

// ============================================
// 🛡️ SECURE VERSION - How to prevent XSS
// ============================================
app.get('/safe-endpoint', (req, res) => {
    // Sanitize ALL user input
    const sanitize = (str) => {
        return str.replace(/[<>\"']/g, (m) => ({
            '<': '&lt;', '>': '&gt;', 
            '"': '&quot;', "'": '&#x27;'
        })[m]);
    };
    
    const userInput = req.query.data;
    const safeOutput = userInput ? sanitize(userInput) : 'No data';
    
    res.send(`
        <h1>Safe Output</h1>
        <p>User input (sanitized): ${safeOutput}</p>
        <p>Original: ${userInput || 'none'}</p>
    `);
});

// ============================================
// 🧪 XSS TEST PAGE (Educational)
// Shows vulnerable vs secure patterns
// ============================================
app.get('/xss-lab', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>XSS Educational Lab</title>
            <style>
                body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                .warning { background: #ffebee; border: 2px solid #c62828; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                .section { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .vulnerable { border-left: 4px solid #c62828; }
                .secure { border-left: 4px solid #2e7d32; }
                code { background: #e0e0e0; padding: 2px 6px; border-radius: 4px; }
                pre { background: #263238; color: #aed581; padding: 15px; overflow-x: auto; border-radius: 8px; }
                button { padding: 10px 20px; cursor: pointer; margin: 5px; }
                .danger { background: #c62828; color: white; border: none; border-radius: 4px; }
                .safe { background: #2e7d32; color: white
