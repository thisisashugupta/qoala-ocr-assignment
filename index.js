import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import detectText from './utils/vision.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import Card from'./models/ocr-data.js';
dotenv.config();
const PORT = process.env.PORT || 3000;

// strict mode of mongodb is off
mongoose.set("strictQuery", true);

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

        const response = await fetch('http://localhost:3000/createRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: receivedText }),
        });
        console.log(response.status, response.statusText);

        return res.status(200).send({ message: 'File uploaded successfully!', text: receivedText });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
}

app.post('/detectText', upload.single('image'), handlePostRequest);
//   (req,res) => {
//     res.json({
//       success: 1,
//       profile_url: `http://localhost:3000/uploads/${req.file.filename}`
//     });
//   }
//  );

// Create a record
app.post('/createRecord', async (req, res) => {
    try {
      const { data } = req.body;
      const newRecord = new Card(
        { 
            name: data.name, 
            lastName: data.lastName, 
            dateOfBirth: data.dateOfBirth, 
            identificationNumber: data.identificationNumber, 
            dateOfIssue: data.dateOfIssue, 
            dateOfExpiry: data.dateOfExpiry 
        });
      const savedRecord = await newRecord.save();
      res.status(201).json(savedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get all records
app.get('/getAllRecords', async (req, res) => {
    try {
        const allRecords = await Card.find();
        
      if (!allRecords) {
        return res.status(404).json({ message: 'Records not found' });
      }
      res.json({ records: allRecords });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get a record by ID
app.get('/getRecord/:id', async (req, res) => {
    try {
      const record = await Card.findById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ record: record });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Edit a record by ID
  // Edit a record
app.put('/editRecord/:id', async (req, res) => {
    try {
      const { data } = req.body;
      const updatedRecord = await Card.findByIdAndUpdate(
        req.params.id, // The ID of the document to update
        {
          $set: {
            name: data.name,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            identificationNumber: data.identificationNumber,
            dateOfIssue: data.dateOfIssue,
            dateOfExpiry: data.dateOfExpiry,
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedRecord) {
        // If the document with the specified ID is not found
        return res.status(404).json({ error: 'Record not found' });
      }
  
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a record by ID
  app.delete('/deleteRecord/:id', async (req, res) => {
    try {
      const deletedRecord = await Card.findByIdAndDelete(req.params.id);
      if (!deletedRecord) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ deletedRecord: deletedRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('*', (req, res) => {
    res.send('Hello, OCR Server is running! Please make a POST request to /detectText to detect text in an image.');
});

// connect to database
async function connectDB() {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
  
  function startListening() {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  }
  
  connectDB().then(startListening());
  
  console.log("hi!");
  