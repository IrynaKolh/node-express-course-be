import { buildResponse } from '../utils/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { config } from "dotenv";
config();
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({
  region: "us-east-2",
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const products = new ScanCommand({
      TableName: "ikol-products",
    });

    const stocks = new ScanCommand({
      TableName: "ikol-stocks",
    });

    const productItems = (await docClient.send(products)).Items;
    const stockItems = (await docClient.send(stocks)).Items;

    const joinedResult = productItems?.map((product) => {
      const stock = stockItems?.find((stock) => stock.product_id === product.id);
      const readableResponse = {
        description: product.description.S,
        id: product.id.S,
        price: product.price.N,
        title: product.title.S,
        count: stock?.count.N || 0
      };
      return readableResponse;
    });

    return buildResponse(200, joinedResult);

  } catch (error: any) {
    return buildResponse(500, {
      message: error.message
    })
  }
}