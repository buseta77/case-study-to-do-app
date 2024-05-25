import * as Minio from "minio";
import { Readable } from 'stream';

interface File {
  data: Buffer;
}

// https://min.io/docs/minio/linux/developers/javascript/API.html
const MinioFreeDevBucketObj = {
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
}


const minioClient = new Minio.Client(MinioFreeDevBucketObj);

const setPublicPolicy = async () => {
  const bucketName = 'to-do-files';
  const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`
      }]
  });

  try {
      await minioClient.setBucketPolicy(bucketName, policy);
  } catch (err) {
      console.error('Error setting bucket policy:', err);
  }
};

setPublicPolicy();

const getBucket = async (): Promise<string> => {
  const bucketName = "to-do-files";
  const isBucketExist = await minioClient.bucketExists(bucketName);
  if (!isBucketExist) {
    try {
      await minioClient.makeBucket(bucketName, "us-east-1");
    } catch (error) {
      console.error("Error creating bucket", error);
      throw error;
    }
  }
  return bucketName;
};

export const uploadFile = async (file: File, fileName: string): Promise<string> => {
  const bucketName = await getBucket();
  const fileSize = file.data.length;

  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, fileName, file.data, fileSize, (err: Error|null, etag?: string) => {
      if (err) {
        console.error(`Error on file upload: ${fileName}`, err);
        reject(err);
        return;
      }
      console.log(`File upload successful: ${fileName}`);
      resolve(etag!);
    });
  });
};

export const getFile = async (fileName: string): Promise<Readable> => {
  const bucketName = await getBucket();

  return minioClient.getObject(bucketName, fileName);
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const bucketName = await getBucket();

  return new Promise((resolve, reject) => {
    minioClient.removeObject(bucketName, fileName, (error) => {
      if (error) {
        console.error(`Error on file delete: ${fileName}`, error);
        reject(error);
        return;
      }
      console.log(`File delete successful: ${fileName}`);
      resolve();
    });
  });
};
