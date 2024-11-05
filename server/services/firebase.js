import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './printware-2af4c-firebase-adminsdk-gr4c0-d0995f709e.json' assert { type: 'json' };
// const serviceAccount = require('./printware-2af4c-firebase-adminsdk-gr4c0-d0995f709e.json');

const firebaseWebApp = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://printware-2af4c.firebaseio.com'
});

let webAuth = getAuth(firebaseWebApp);

export default firebaseWebApp;

export { webAuth };