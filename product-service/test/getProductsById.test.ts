import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from "../src/handlers/getProductsById";

const mockProduct = {
  title: "Pumpkin cheescake",
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  price: 25,
  description: "Contains: chocolate crackers, unsalted butter, cream cheese, heavy whipping cream, pumpkin puree, sugar, corn starch, eggs, walnuts, zest of orange."
};

describe('handler', () => {
  it('get one product', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    const mockEvent: APIGatewayProxyEvent = {
      body: '',
      httpMethod: 'GET',
      path: `/products/${productId}`,
      queryStringParameters: {},
      headers: {},
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      pathParameters: {
        productId,
      },
      requestContext: {} as any,
      resource: '',
      stageVariables: {},
    };

    const result: APIGatewayProxyResult = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockProduct);
  });

  it('should return a 404 response if the product does not exist', async () => {
    const nonExistentProductId = '7567ec4b-b10c-48c5-9345-fc73c48a80a7';
    const mockEvent: APIGatewayProxyEvent = {
      body: '',
      httpMethod: 'GET',
      path: `/products/${nonExistentProductId}`,
      queryStringParameters: {},
      headers: {},
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      pathParameters: {
        productId: nonExistentProductId,
      },
      requestContext: {} as any,
      resource: '',
      stageVariables: {},
    };

    const result: APIGatewayProxyResult = await handler(mockEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Product not found' });
  });
})