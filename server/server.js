import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
// import serveIndex from 'serve-index';

// Load environment variables
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// app.use(serveIndex(join(__dirname, '../web/build'), { icons: true }));
app.use(express.static(join(__dirname, '../web/build')));

// Middlewares
app.use(express.json());

// Apply authentication middleware
import authenticate from './middlewares/authentication.js';
// app.use(authenticate);

const whitelist = ['/', '/favicon.ico', '/spso/test'];

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  console.log('Request: ', req.path);
  if (!whitelist.includes(req.path)) {
    console.log('Authenticating...');
    return authenticate(req, res, next);
  }
  else {
    console.log('Skipping authentication...');
  }
  next();
});

// Import routes
import SPSORoutes from './routes/web_routes/HCMUTSSORoute.js';
app.use('/spso', SPSORoutes);
    
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});