// Simple keep-alive script for Render free tier
// Pings your backend and ML backend every 10 minutes to prevent cold starts

const https = require('https');

const urls = [
  'https://daiict-code-canvas-1.onrender.com/health',
  'https://daiict-code-canvas.onrender.com/health'
];

function ping(url) {
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Pinged ${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`[${new Date().toISOString()}] Error pinging ${url}:`, e.message);
  });
}

function keepAlive() {
  urls.forEach(ping);
}

// Ping immediately, then every 10 minutes
keepAlive();
setInterval(keepAlive, 10 * 60 * 1000);
