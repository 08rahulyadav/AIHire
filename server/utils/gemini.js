import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log(
  "Gemini API Key Loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default ai;