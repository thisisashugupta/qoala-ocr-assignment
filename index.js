import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import detectText from './utils/vision.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import Card from'./models/ocr-data.js';

// strict mode of mongodb is off
mongoose.set("strictQuery", false);

// Set up multer storage to save the file to disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        console.log("uploadPath:", uploadPath);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

async function handlePostRequest(req, res) {
    try {
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ error: 'No image uploaded. Retry with uploading an image.' });
        }

        // detect text from uploaded image
        const receivedText = await detectText(imageFile.path);
        // upload result to db

        return res.status(200).send({ message: 'File uploaded successfully!', text: receivedText });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
}

app.post('/detectText', upload.single('image'), handlePostRequest);

app.post("/createRecord", async (req, res) => {
    // const recordExists = await Card.findOne({ data: data });
    
  });

app.get('*', (req, res) => {
    res.send('Hello, OCR Server is running! Please make a POST request to /detectText to detect text in an image.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
