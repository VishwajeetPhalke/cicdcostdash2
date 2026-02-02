
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as lambda from 'aws-cdk-lib/aws-lambda';

// export class lambdaStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     new lambda.Function(this, 'demolambda', {
//       runtime: lambda.Runtime.NODEJS_18_X,
//       handler: 'index.handler',
//       code: lambda.Code.fromInline(`
//         exports.handler = async (event) => {
//           console.log("Hello from inline Lambda Vishwajeet  (env:", process.env.ENV, ")");
//           return { statusCode: 200, body: "Hello from inline Lambda and team" };
//         };
//       `),
//       environment: {
//         ENV: cdk.Stack.of(this).stackName,
//       },
//     });
//   }
// }


import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class LambdaStack extends cdk.Stack {
  // 👈 expose this as public so other stacks can read it
  public readonly apiUrlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, 'DemoLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Hello from Lambda (env:", process.env.ENV, ")");
          return { statusCode: 200, body: "Hello from inline Lambda and team" };
        };
      `),
      environment: { ENV: cdk.Stack.of(this).stackName },
    });

    const api = new apigw.LambdaRestApi(this, 'DemoApi', {
      handler: fn,
      proxy: true,
    });

    // 👇 This is the output the pipeline needs for DAST
    this.apiUrlOutput = new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Public URL for DAST scanning',
    });
  }
}
