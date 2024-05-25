"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = exports.uploadFile = void 0;
const Minio = __importStar(require("minio"));
const MinioFreeDevBucketObj = {
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
};
const minioClient = new Minio.Client(MinioFreeDevBucketObj);
const getBucket = async () => {
    const bucketName = "to-do-files";
    const isBucketExist = await minioClient.bucketExists(bucketName);
    if (!isBucketExist) {
        try {
            await minioClient.makeBucket(bucketName, "us-east-1");
        }
        catch (error) {
            console.error("Error creating bucket", error);
            throw error;
        }
    }
    return bucketName;
};
const uploadFile = async (file, fileName) => {
    const bucketName = await getBucket();
    const fileSize = file.data.length;
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, fileName, file.data, fileSize, (err, etag) => {
            if (err) {
                console.error(`Error on file upload: ${fileName}`, err);
                reject(err);
                return;
            }
            console.log(`File upload successful: ${fileName}`);
            resolve(etag);
        });
    });
};
exports.uploadFile = uploadFile;
const getFile = async (fileName) => {
    const bucketName = await getBucket();
    return minioClient.getObject(bucketName, fileName);
};
exports.getFile = getFile;
const deleteFile = async (fileName) => {
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
exports.deleteFile = deleteFile;
