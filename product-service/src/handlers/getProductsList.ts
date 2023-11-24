import { buildResponse } from '../utils/utils';
import { products } from '../mocks/mock-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('handler getProductsList event:', event);
    return buildResponse(200, products)
  } catch (error: any) {
    return buildResponse(500, {
      message: error.message
    })
  }
}