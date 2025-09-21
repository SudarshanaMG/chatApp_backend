import admin from 'firebase-admin';
import fs from "fs/promises";

const serviceAccountRaw = await fs.readFile("./serviceAccountKey.json", "utf-8");
const serviceAccount = JSON.parse(serviceAccountRaw);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat-9aab3-default-rtdb.firebaseio.com',
});

const auth = admin.auth();
const db = admin.database();

export { admin, auth, db };
