
// // lib/cicdpipelinestage-stack.ts
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import { lambdaStack } from './lambda-stack';

// export class PipelineAppStage extends cdk.Stage {
//   constructor(scope: Construct, id: string, props?: cdk.StageProps) {
//     super(scope, id, props);

//     // Add your app stacks for this environment
//     new lambdaStack(this, 'lambdastack', { env: props?.env });
//   }
// }



import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './lambda-stack';

export class PipelineAppStage extends cdk.Stage {
  // 👈 declare the property as public
  public readonly apiUrlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    // Instantiate your application stack(s) for this stage/environment
    const app = new LambdaStack(this, 'LambdaStack', {
      env: props?.env,
    });

    // 👇 Re-expose the CfnOutput so the pipeline can read it
    this.apiUrlOutput = app.apiUrlOutput;
  }
}
