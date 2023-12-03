import * as cdk from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { config } from "dotenv";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';
import * as s3notifications from 'aws-cdk-lib/aws-s3-notifications';
config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "ImportServiceStack", {
  env: { region: "us-east-2" },
});

const corsRule: cdk.aws_s3.CorsRule = {
  allowedMethods: [cdk.aws_s3.HttpMethods.GET, cdk.aws_s3.HttpMethods.POST, cdk.aws_s3.HttpMethods.PUT, cdk.aws_s3.HttpMethods.DELETE, cdk.aws_s3.HttpMethods.HEAD],
  allowedOrigins: ['*'],
  allowedHeaders: ['*'],
};

const bucket = cdk.aws_s3.Bucket.fromBucketName(stack, 'ImportBucket', 'ikol-import-bucket');

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.AWS_REGION!,
    IMPORT_BUCKET_NAME: 'ikol-import-bucket',
  }
};

const importProductsFile = new NodejsFunction(stack, 'ImportProductsFileLambda', {
  ...sharedLambdaProps,
  functionName: 'importProductsFile',
  entry: path.join(__dirname, 'src', 'handlers', 'importProductsFile.ts'),
});

// const policyPutObject = new cdk.aws_iam.PolicyStatement({
//   actions: ["s3:PutObject"],
//   resources: [`arn:aws:s3:::import-bucket/uploaded`],
//   effect: cdk.aws_iam.Effect.ALLOW,
// });

// importProductsFile.addToRolePolicy(policyPutObject);
// bucket.grantRead(new cdk.aws_iam.AccountRootPrincipal());
// bucket.grantReadWrite(importProductsFile);

const api = new apiGateway.HttpApi(stack, 'ImportApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration('ImportProductsFileIntegration', importProductsFile),
  path: '/import',
  methods: [apiGateway.HttpMethod.GET],
})

bucket.addEventNotification(cdk.aws_s3.EventType.OBJECT_CREATED, new s3notifications.LambdaDestination(importProductsFile), { prefix: 'uploaded' });

new cdk.CfnOutput(stack, "ImportUrl", {
  value: api.url!,
});
