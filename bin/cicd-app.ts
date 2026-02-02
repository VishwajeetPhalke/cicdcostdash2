// import * as cdk from 'aws-cdk-lib';
// import { CicdTestPipelineStack } from '../lib/cicd-test-pipeline-stack';
// import { CicdProdPipelineStack } from '../lib/cicd-prod-pipeline-stack';

// const app = new cdk.App();

// const account = '430058392451';
// const region  = 'us-east-1';

// // Test pipeline (watching 'test' branch)
// new CicdTestPipelineStack(app, 'CicdTestPipelineStack', {
//   env: { account, region },
// });

// // Prod pipeline (watching 'main' branch)
// new CicdProdPipelineStack(app, 'CicdProdPipelineStack', {
//   env: { account, region },
// });


import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

// Import your pipelines
import { CicdTestPipelineStack } from '../lib/cicd-test-pipeline-stack';
import { CicdProdPipelineStack } from '../lib/cicd-prod-pipeline-stack';

// cdk-nag best practice checks
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';

// Create the CDK app
const app = new cdk.App();

// ENABLE SECURITY CHECKS (AWS Best Practices)
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

// Common environment for all stacks
const env = {
  account: '430058392451',  // <-- your AWS account
  region: 'us-east-1'       // <-- your region
};

// ---------------------------------------
// TEST PIPELINE (watches `test` branch)
// ---------------------------------------
new CicdTestPipelineStack(app, 'CicdTestPipelineStack', {
  env: env
});

// ---------------------------------------
// PROD PIPELINE (watches `main` branch)
// ---------------------------------------
new CicdProdPipelineStack(app, 'CicdProdPipelineStack', {
  env: env
});
