import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    name: {
      type: String,
    //   required: true,
    },
    lastName: {
      type: String,
    //   required: true,
    },
    dateOfBirth: {
      type: String,
    //   required: true,
    },
    identificationNumber: {
      type: String,
    //   required: true,
    },
    dateOfIssue: {
      type: String,
    //   required: true,
    },
    dateOfExpiry: {
      type: String,
    //   required: true,
    },
  });
  
  // Create the model
  const Card = mongoose.model('Card', cardSchema);

// create simple Task function
Card.createRecord = async function (name, lastName, dateOfBirth, identificationNumber, dateOfIssue, dateOfExpiry) {
    const newRecord = new this({
      name,
      lastName,
      dateOfBirth,
      identificationNumber,
      dateOfIssue,
      dateOfExpiry,
    });
    const savedRecord = await newRecord.save();
    console.log("\nRecord added successfully:", savedRecord);
    return savedRecord;
  };

// Card.createRecord("John", "Doe", "01/01/1990", "1234567890123", "01/01/2000", "01/01/2020");

export default Card;