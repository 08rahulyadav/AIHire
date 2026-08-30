import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractPdfText = async (filePath) => {
  let parser;

  try {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(filePath);

    if (!dataBuffer || dataBuffer.length === 0) {
      throw new Error("PDF file is empty");
    }

    // Create PDF parser
    parser = new PDFParse({
      data: dataBuffer,
    });

    // Extract text
    const result = await parser.getText();

    const text = result?.text
      ?.replace(/\r/g, "")
      ?.replace(/[ \t]+/g, " ")
      ?.replace(/\n\s*\n\s*\n+/g, "\n\n")
      ?.trim();

    console.log(
      "Extracted PDF text length:",
      text?.length || 0
    );

    // Check readable content
    if (!text || text.length < 50) {
      throw new Error(
        "Could not extract readable text from this PDF. The PDF may be scanned or image-based."
      );
    }

    return text;
  } catch (error) {
    console.error("PDF text extraction error:", error);

    throw new Error(
      error.message || "Failed to extract text from PDF"
    );
  } finally {
    // Cleanup parser
    if (parser) {
      try {
        await parser.destroy();
      } catch (error) {
        console.error(
          "PDF parser cleanup error:",
          error.message
        );
      }
    }
  }
};

export default extractPdfText;