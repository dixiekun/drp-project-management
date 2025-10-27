import pdf from "pdf-parse-fork";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}

export async function extractTextFromFile(file: File): Promise<string | null> {
  const fileType = file.type.toLowerCase();

  // Handle PDF files
  if (fileType === "application/pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await extractTextFromPDF(buffer);
  }

  // Handle text files
  if (fileType === "text/plain" || fileType === "text/markdown") {
    return await file.text();
  }

  // Images - we'll just return null for now (could add OCR later)
  if (fileType.startsWith("image/")) {
    return null;
  }

  // For other file types, return null
  return null;
}
