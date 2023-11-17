import { buildResponse } from '../utils/utils';
import { products } from '../mocks/mock-data';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('handler getProductsById  event:', event);
    const productId = event.pathParameters?.productId;
    if (productId) {
      const product = products.find(product => product.id === productId);
      if (product) {
        return buildResponse(200, {
          product
        })
      } else {
        return buildResponse(404, {
          message: 'Product not found'
        })
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