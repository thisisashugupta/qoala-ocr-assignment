import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

//configuration
const gemini_api_key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(gemini_api_key);

const generationConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const model = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
  generationConfig,
});

const getJsonFromGemini = async (imagePath) => {
  try {
    
    const imageData = await fs.readFile(imagePath);
    const encodedImage = imageData.toString("base64");

    const prompt = "Provide me the following details from the Thai ID Card provided - Identification Number (usually a 13 digit number), Name (or First Name) , Last name, Date of Birth, Date of Issue, Expiry Date. Provide the output in JSON format as { identificationNumber: , name: , lastName: , dateOfBirth: , dateOfIssue: ,dateOfExpiry: } . only provide the json object as output, nothing else.";
    
    const parts = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: encodedImage,
        },
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    const response = await result.response;
    let jsonData = null;
    
    try {
        jsonData = JSON.parse(response.text().trim().slice(7,-3));
    } catch (error) {
        console.log("Error parsing json", error);
    }
    
    return jsonData;
    
  } catch (error) {
    console.error("Error reading text from image using gemini :", error);
  }
};

export default {};
export { getJsonFromGemini };