import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse } from "../utils/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { NewItem, Product, Stock } from "../mocks/mock-data";
import { productSchema } from "../schemas/product";

const client = new DynamoDBClient({
  region: "us-east-2",
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('handler createProduct  event:', event);
  try {
    const body = event.body;

    if (!body) {
      return buildResponse(400, { message: 'Body is required' });
    }
    const product = JSON.parse(body);
    const { value, error } = productSchema.validate(product);
    if (error != null) {
      console.log(error.message);
      return buildResponse(
        400,
        { message: error.message },
      );
    }
    const id = uuidv4();

    const newProduct: Product = {
      id: id,
      description: value.description,
      title: value.title,
      price: Number(value.price),
    };

    const newStock: Stock = {
      product_id: id,
      count: Number(value.count),
    }

    const newItem: NewItem = {
      id: id,
      description: value.description,
      title: value.title,
      price: Number(value.price),
      count: Number(value.count),
    }

    const newProductPromise = await docClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: 'ikol-products',
              Item: newProduct
            },
          },
          {
            Put: {
              TableName: 'ikol-stocks',
              Item: newStock,
            },
          },
        ],
      }),
    );

    console.log(newProductPromise);

    return buildResponse(200, { newProduct: newItem });

  } catch (error: any) {
    return buildResponse(500, { message: error.message });
  }
};