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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply authentication middleware
import Authenticate from './middlewares/AuthenMiddleware.js';

const whitelist = ['/', '/favicon.ico', '/enroll-events'];

// app.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   console.log('Request: ', req.path);
//   if (!whitelist.includes(req.path)) {
//     console.log('Authenticating...');
//     return authenticate(req, res, next);
//   }
//   else {
//     console.log('Skipping authentication...');
//   }
//   next();
// });

import EnrollUser from './utils/EnrollUser.js';

// Enpoint for user to enroll and receive notification from server
app.get('/enroll-events', (req, res) => {
  console.log('Received a enroll event request!');
  console.log('Request: ', req.query);

  if (!req.query || !req.query.userId) {
    res.status(400).json({ message: 'Missing required parameters.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!EnrollUser.getInstance().IsInEnrolledUsers(req.query.userId)) {
    EnrollUser.getInstance().AddEnrolledUser(req.query.userId, res);
  }
  else {
    res.status(208).json({ message: 'User is already enrolled.' });
  }

  req.on('close', () => {
    console.log('Client disconnected.');
    EnrollUser.getInstance().enrolledUsers = EnrollUser.getInstance().enrolledUsers.filter(client => client.res !== res);
  });
})

// Import routes
import HCMUT_SSO from './routes/web_routes/HCMUTSSORoute.js';
app.use('/hcmut-sso', HCMUT_SSO);

import SPSO from './routes/web_routes/SPSORoutes.js';
app.use('/spso', SPSO);

import Printer from './routes/web_routes/PrinterRoutes.js';
app.use('/printer', Printer);

import Document from './routes/web_routes/DocumentRoutes.js';
app.use('/document', Document);

// import Payment from './routes/web_routes/PaymentRoutes.js';
// app.use('/payment', Payment);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});