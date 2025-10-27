import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function uploadToR2(file: File, key: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await r2Client.send(command);
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}
