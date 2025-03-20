const express = require('express');
const path = require('path');
const app = express();

// Configurar tipos MIME
express.static.mime.define({'application/javascript': ['js']});
express.static.mime.define({'text/css': ['css']});
express.static.mime.define({'image/x-icon': ['ico']});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../dist/browser'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    }
  }
}));

// Manejar favicon.ico específicamente
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/browser/favicon.ico'));
});

// Manejar todas las rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/browser/index.html'));
});

// Export the Express API
module.exports = app; 