import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat-9aab3-default-rtdb.firebaseio.com',
});

const auth = admin.auth();
const db = admin.database();

export { admin, auth, db };
