import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);

export const uploadToStorage = async (file) => {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const blob = bucket.file(fileName);
  
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject(error));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};