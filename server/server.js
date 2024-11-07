import path, { dirname, join, resolve } from 'path';
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

// Middlewares
app.use(express.json());

// app.use(serveIndex(join(__dirname, '../web/build'), { icons: true }));
app.use(express.static(join(__dirname, '../web/build')));

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// Import routes
import webRouter from './routes/web_routes/web.js';
app.use('/web-api', webRouter);

import authRouter from './routes/auth.js';
app.use('/auth-api', authRouter);

import authenticate from './middleware/authenticate.js';
app.use(authenticate);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});