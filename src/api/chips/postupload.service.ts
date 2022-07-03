import S3 from "aws-sdk/clients/s3";
import fs from "fs";

import config from "../../config";

const s3 = new S3({
    region: config.awsBucketRegion,
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
})

async function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
      Bucket: config.awsBucketName,
      Body: fileStream,
      Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}

export const postUploadService = async (file: any) => {
    const response = uploadFile(file)
    return response;
}