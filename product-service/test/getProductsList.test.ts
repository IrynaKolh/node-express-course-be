import { handler } from '../src/handlers/getProductsList'
import { buildResponse } from '../src/utils/utils';
import { products } from '../src/mocks/mock-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const mockEvent: APIGatewayProxyEvent = {
  body: '',
  httpMethod: 'GET',
  path: '/',
  queryStringParameters: {},
  headers: {},
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  pathParameters: {},
  requestContext: {} as any,
  resource: '',
  stageVariables: {},
};

describe('getProductsList', () => {
  test('Get all products', async () => {
    const response: APIGatewayProxyResult = await handler(mockEvent);
    expect(response.statusCode).toEqual(200);
    expect(response).toEqual(
      buildResponse(200, products)
    )
  });
});