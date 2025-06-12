/**
 * Real HTTP server for Fmengo dating app
 */

// Using Node.js built-in http module instead of Express
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

// Define route handlers
const routes: Record<string, Record<string, (req: IncomingMessage, res: ServerResponse) => void>> = {
  '/': {
    'GET': (req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to Fmengo API');
    }
  },
  '/health': {
    'GET': (req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    }
  },
  '/api/auth/register': {
    'POST': (req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User registered successfully' }));
    }
  },
  '/api/auth/login': {
    'POST': (req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: 'simulated-jwt-token', user: { id: '1', name: 'Test User' } }));
    }
  }
};

// Create HTTP server
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '/';
  const method = req.method || 'GET';

  // Handle CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Check if route exists
  if (routes[url] && routes[url][method]) {
    routes[url][method](req, res);
  } else {
    // Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3002;

// Start the server
server.listen(PORT, () => {
  console.log(`
====================================================
  Fmengo API Server
====================================================
  Server is running on http://localhost:${PORT}
  
  Available endpoints:
  - GET /             : Welcome message
  - GET /health       : Health check
  - POST /api/auth/register : User registration
  - POST /api/auth/login    : User login
  
  Note: This is now a real HTTP server using Node.js
  built-in http module. You can access it at:
  http://localhost:${PORT}
====================================================
`);
});
