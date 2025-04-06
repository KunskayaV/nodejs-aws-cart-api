#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NestjsAwsShopBeCartStack } from '../lib/nestjs-aws-shop-be-cart-stack';

import * as dotenv from 'dotenv';
dotenv.config();

const app = new cdk.App();
new NestjsAwsShopBeCartStack(app, 'rs-toy-shop-be-cart-stack', {
  // If you need to add env-specific configuration
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
