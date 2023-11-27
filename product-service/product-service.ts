import * as cdk from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { config } from "dotenv";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';


config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "ProductServiceStack", {
  env: { region: "us-east-2" },
});

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!,
    TABLE_PRODUCTS: 'ikol-products',
    TABLE_STOCKS: 'ikol-stocks',
  }
};

const getProductList = new NodejsFunction(stack, 'GetProductListLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsList',
  entry: path.join(__dirname, 'src', 'handlers', 'getProductsList.ts'),
})

const getProductsById = new NodejsFunction(stack, 'GetProductsByIdLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsById',
  entry: path.join(__dirname, 'src', 'handlers', 'getProductsById.ts'),
})

// const productsTable = Table.fromTableName(stack, 'products', process.env.DB_PRODUCTS || 'ikol-products');
// const stocksTable = Table.fromTableName(stack, 'stock', process.env.DB_STOCKS || 'ikol-stock');

const productsTable = new Table(stack, 'products', {
  tableName: "ikol-products",
  partitionKey: { name: 'id', type: AttributeType.STRING },
  sortKey: { name: 'title', type: AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const stocksTable = new Table(stack, 'stock', {
  tableName: "ikol-stocks",
  partitionKey: { name: 'product_id', type: AttributeType.STRING },
  sortKey: { name: 'count', type: AttributeType.NUMBER },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

productsTable.grantReadData(getProductList);
productsTable.grantReadData(getProductsById);
stocksTable.grantReadData(getProductList);
stocksTable.grantReadData(getProductsById);

const api = new apiGateway.HttpApi(stack, 'ProductApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductListIntegration', getProductList),
  path: '/products',
  methods: [apiGateway.HttpMethod.GET],
})

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductsByIdIntegration', getProductsById),
  path: '/products/{productId}',
  methods: [apiGateway.HttpMethod.GET],
})

new cdk.CfnOutput(stack, "LambdaURL", {
  value: api.url!,
});
