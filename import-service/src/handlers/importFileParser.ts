import { APIGatewayProxyResult, S3Event } from "aws-lambda";
import { buildResponse } from "../utils/utils";
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import csv = require('csv-parser');

interface PutObjectParams {
  ContentType: string;
  Bucket: string;
  Key: string;
}

interface CopyObjectParams extends PutObjectParams {
  CopySource: string;
}

const bucketName = "ikol-import-bucket";
const client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
});

export const handler = async (event: S3Event): Promise<any> => {
  console.log('event', event);

  try {
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const fileName = key.split('/').at(-1);

    const putObjectParams: PutObjectParams = {
      ContentType: 'text/csv',
      Bucket: bucketName,
      Key: decodeURIComponent(key),
    };

    const copyObjectParams: CopyObjectParams = {
      ...putObjectParams,
      Key: `parsed/${fileName}`,
      CopySource: `${bucketName}/${key}`,
    };

    const command = new GetObjectCommand(putObjectParams);
    const copyCommand = new CopyObjectCommand(copyObjectParams);
    const deleteCommand = new DeleteObjectCommand(putObjectParams);

    const responseStream = await client.send(command);
    if (!responseStream) {
      throw ({ message: 'Stream is required', statusCode: 400 });
    }
    const readableStream = responseStream.Body as Readable;
    if (!readableStream) {
      throw ({ message: 'Failed to read from s3 bucket', statusCode: 400 });
    }

    const result = await new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on('data', (data: any) => console.log(data))
        .on('end', async () => {
          console.log('Read all data');
          await client.send(copyCommand);
          console.log('File copied to parsed folder');
          await client.send(deleteCommand);
          console.log('File deleted from uploaded folder');
          resolve(true);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });

    return buildResponse(200, { result });
  } catch (e) {
    console.error(e);
    return buildResponse(500, { message: 'Could not get url' });
  }
};