import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class NestjsAwsShopBeCartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define your AWS resources here
    const handler = new NodejsFunction(this, 'nestjs-aws-shop-be-cart-lambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'dist/main.js', // Path to your Lambda handler file
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),

      bundling: {
        externalModules: [
          '@aws-sdk/*', // Don't bundle AWS SDK
          '@nestjs/microservices', // Don't bundle NestJS microservices
          '@nestjs/websockets', // Don't bundle NestJS core
        ],
        minify: true, // Minify the code
        sourceMap: true, // Enable source maps
      },
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_PORT: process.env.DB_PORT || '',
        DB_USERNAME: process.env.DB_USERNAME || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_NAME: process.env.DB_NAME || '',
      },
    });

    // Add Function URL to Lambda
    const fnUrl = handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // Makes the URL public
      cors: {
        allowedOrigins: ['*'], // Configure CORS as needed
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    });

    // const fnUrl = handler.addFunctionUrl({
    //   authType: FunctionUrlAuthType.AWS_IAM,
    //   cors: {
    //     allowedOrigins: ['https://your-domain.com'],
    //     allowedMethods: [
    //       lambda.HttpMethod.GET,
    //       lambda.HttpMethod.POST,
    //       lambda.HttpMethod.PUT,
    //       lambda.HttpMethod.DELETE,
    //     ],
    //     allowedHeaders: [
    //       'Content-Type',
    //       'Authorization',
    //       'X-Amz-Date',
    //       'X-Api-Key',
    //       'X-Amz-Security-Token',
    //     ],
    //     maxAge: cdk.Duration.minutes(30),
    //   },
    // });

    // Output the Function URL
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: fnUrl.url,
      description: 'Lambda Function URL',
    });
  }
}
