import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Service } from "typedi";

@Service()
export class StorageService {
  private readonly client: S3Client;
  //created connection in constrctucor
  constructor() {
    this.client = new S3Client({
      endpoint: process.env.B2_ENDPOINT, //b2 server
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY as string,
      },
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileName, //where
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.client.send(command); //upload to b2
  }
  //generate temporary access url
  public async getSignedFileUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileName,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: 60 * 60, //only url expire img isnt deleted
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileName,
    });

    await this.client.send(command);
  }
}
