import * as cdk from 'aws-cdk-lib';
import { CicdTestPipelineStack } from '../lib/cicd-test-pipeline-stack';
import { CicdProdPipelineStack } from '../lib/cicd-prod-pipeline-stack';

const app = new cdk.App();

const account = '430058392451';
const region  = 'us-east-1';

// Test pipeline (watching 'test' branch)
new CicdTestPipelineStack(app, 'CicdTestPipelineStack', {
  env: { account, region },
});

// Prod pipeline (watching 'main' branch)
new CicdProdPipelineStack(app, 'CicdProdPipelineStack', {
  env: { account, region },
});
