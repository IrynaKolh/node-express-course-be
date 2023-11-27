import { buildResponse } from '../utils/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: "us-east-2",
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('handler getProductsById  event:', event);
  const id = event.pathParameters?.['productId'];

  try {
    if (id !== undefined) {
      const products = new QueryCommand({
        TableName: "ikol-products",
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
      });

      const stocks = new QueryCommand({
        TableName: "ikol-stocks",
        KeyConditionExpression: "product_id = :product_id",
        ExpressionAttributeValues: { ':product_id': { S: id } },
      });

      const productItems = await docClient.send(products);
      const stockItems = await docClient.send(stocks);

      if (!productItems.Items?.length || !stockItems.Items?.length) {
        return buildResponse(404, {
          message: 'Product not found'
        })
      } else {
        const readableResponse = {
          description: productItems.Items[0].description.S,
          id: productItems.Items[0].id.S,
          price: productItems.Items[0].price.N,
          title: productItems.Items[0].title.S,
          count: stockItems.Items[0].count.N
        };
        return buildResponse(200, readableResponse)
      }
    } else {
      return buildResponse(404, {
        message: 'Product not found'
      })
    }  

  } catch (error: any) {
    return buildResponse(500, {
      message: error.message
    })
  }
}