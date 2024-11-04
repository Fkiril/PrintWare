import path, { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import serveIndex from 'serve-index';

// Load environment variables
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

app.use('/request-type', (req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});

app.use(serveIndex(join(__dirname, '../web/build'), { icons: true }));
app.use(express.static(join(__dirname, '../web/build')));

// Import routes
import homeRouter from './routes/index.js';
app.use('/', homeRouter);

import webRouter from './routes/web.js';
app.use('/web', webRouter);

// app.get('*', (req, res) => {
//   console.log(join(__dirname, '../web/build/index.html'));
//   res.sendFile(join(__dirname, '../web/build/index.html'));
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});