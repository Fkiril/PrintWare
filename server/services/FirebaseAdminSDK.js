import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

import serviceAccount from './firebase-admin-api-key.json' assert { type: 'json' };
// const serviceAccount = require('./printware-2af4c-firebase-adminsdk-gr4c0-d0995f709e.json');

const adminApp = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://printware-2af4c.firebaseio.com'
});

const adminAuth = getAuth(adminApp);
const firestore = getFirestore(adminApp);

export default adminApp;

export { adminAuth, firestore };