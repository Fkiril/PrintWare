const admin = require('firebase-admin');
const serviceAccount = require('./server.json'); // Đổi thành đường dẫn chính xác của tệp server.json

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

module.exports = db;
