import express from 'express';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const app = express();
app.use(express.json());
const port = 3000;

const firebaseConfig = {
  apiKey: "AIzaSyDT7N55z9cNtaI1aVcskVALCW9K09Q3iWQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://chat-9aab3-default-rtdb.firebaseio.com",
  projectId: "chat-9aab3",
  storageBucket: "chat-9aab3.firebasestorage.app",
  messagingSenderId: "29454175828",
  appId: "1:29454175828:android:f76997b096c1802106a7c1",
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try{
        await createUserWithEmailAndPassword(auth, email, password);
        res.status(200).send('User registered');
    }catch(error){
        res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        res.status(200).json({ message: 'User logged in', token });

    }catch(error){
        res.status(400).send(error.message);
    };
});

app.post('/post', async (req, res) => {
    const message = req.body.message;
    const timeStamp = Date.now();
    const messageRef = ref(database, 'chats/chatId1/messages');
    try{
        await push(messageRef, {
            senderId: 'user1',
            message: message,
            timeStamp: timeStamp
        });
        res.status(200).send('Message sent');
    }catch(error){
        res.status(400).send(error.message);
    }
});


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});


