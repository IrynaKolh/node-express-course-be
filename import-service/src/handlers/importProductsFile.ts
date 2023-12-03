import { buildResponse } from '../utils/utils';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
});
const bucketName = "ikol-import-bucket";
const presignedUrl = (client: S3Client, command: PutObjectCommand) => {
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    console.log('event', event);

    const fileName = event.queryStringParameters?.name;
    console.log(fileName);

    if (!fileName) {
      throw ({ message: 'Bad request', statusCode: 400 });
    }

    const putObjectParams = {
      ContentType: 'text/csv',
      Bucket: bucketName,
      Key: `uploaded/${fileName}`
    };

    const command = new PutObjectCommand(putObjectParams);
    const url = await presignedUrl(client, command);

    return buildResponse(200, { url });
  } catch (err: any) {
    console.log('err', err);
    return buildResponse(500, err.message)
  }
}