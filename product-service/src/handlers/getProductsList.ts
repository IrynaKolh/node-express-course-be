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
  console.log('handler getProductsList event:', event);
  try {
    const products = new ScanCommand({
      TableName: "ikol-products",
    });

    const stocks = new ScanCommand({
      TableName: "ikol-stocks",
    });

    const productItems = (await docClient.send(products)).Items;
    const stockItems = (await docClient.send(stocks)).Items;

    console.log(productItems)
    console.log(stockItems)

    if (productItems && stockItems) {
      const joinedResult = productItems.map((product) => {
        const stock = stockItems.find((stock) => stock.product_id['S'] === product.id['S']);
        const readableResponse = {
          description: product.description.S,
          id: product.id.S,
          price: Number(product.price.N),
          title: product.title.S,
          count: Number(stock?.count.N) || 0
        };
        return readableResponse;
      });
      return buildResponse(200, joinedResult);
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