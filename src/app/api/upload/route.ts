import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToR2 } from "@/lib/r2";
import { extractTextFromFile } from "@/lib/extract-text";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const timestamp = Date.now();
      const key = `${userId}/${timestamp}-${file.name}`;

      // Extract text content from file
      const content = await extractTextFromFile(file);

      // Upload to R2
      const url = await uploadToR2(file, key);

      uploadedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        key,
        content,
      });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
