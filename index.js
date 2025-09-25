import express from 'express';
import cors from 'cors';
import { auth, db } from './firebase.js';
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// cloudinary.config({
//   cloud_name: 'cloudName',
//   api_key: 'APIKEY',
//   api_secret: 'apiSecret',
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const uploadImageToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'image',
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true,
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );

//     stream.end(fileBuffer);
//   });
// };

app.post('/register', upload.single('file'), async (req, res) => {
  const { email, password, userName, imageUri } = req.body;
  // const file = req.file;
  // let imageUri = '';

  try {
    // if (file) {
    //   imageUri = await uploadImageToCloudinary(file.buffer);
    // }
    const user = await auth.createUser({
      email,
      password,
      userName: userName || '',
      imageUri
    });

    await db.ref(`users/${user.uid}`).set({
      email,
      userName: userName || '',
      uid: user.uid,
      imageUri,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: 'User registered successfully', uid: user.uid, imageUri });
  } catch (error) {
    console.error('Error in /register:', error.message);
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
  console.log(`Server running on port: ${port}`);
});
