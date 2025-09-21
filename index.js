import express from 'express';
import cors from 'cors';
import { auth, db } from './firebase.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    const user = await auth.createUser({
      email,
      password,
      userName: userName || '',
    });

    await db.ref(`users/${user.uid}`).set({
      email,
      userName: userName || '',
      createdAt: Date.now(),
    });

    res.status(201).json({ message: 'User registered successfully', uid: user.uid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.ref('users').once('value');
    const users = snapshot.val();

    res.status(200).json(Object.values(users || {}));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.post('/post', async (req, res) => {
  const { chatId, senderId, message } = req.body;

  if (!chatId || !senderId || !message) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const timeStamp = Date.now();
  const messageRef = db.ref(`messages/${chatId}`);

  try {
    await messageRef.push({
      senderId,
      message,
      timeStamp,
    });

    await db.ref(`chats/${chatId}/lastMessage`).set({
      senderId,
      message,
      timeStamp,
    });

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
