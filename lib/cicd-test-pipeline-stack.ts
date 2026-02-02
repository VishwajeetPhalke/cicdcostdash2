
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
  CodeBuildStep,
} from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { PipelineAppStage } from './cicdpipelinestage-stack';

export class CicdTestPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'TestPipeline', {
      pipelineName: 'CICD-Pipeline-Test',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          'VishwajeetPhalke/cicdcostdash2',
          'test',
          { connectionArn: 'arn:aws:codeconnections:us-east-1:430058392451:connection/b1b0d224-2619-4c1b-a7cb-b56248c3f529' }
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    // (Optional) security wave pre-deploy…

    // ---------- Add the stage (this creates TEST env) ----------
    const testApp = new PipelineAppStage(this, 'test', {
      env: { account: this.account, region: this.region },
    });

    const testStage = pipeline.addStage(testApp);

    // ---------- DAST step that needs the API URL ----------
    testStage.addPost(new CodeBuildStep('DAST_ZAP_Baseline', {
      // 👇 IMPORTANT: pass the CfnOutput object, not a string
      envFromCfnOutputs: {
        TARGET_URL: testApp.apiUrlOutput,
      },
      commands: [
        'echo "Running ZAP baseline scan on $TARGET_URL"',
        'apt-get update && apt-get install -y docker.io',
        'docker pull ghcr.io/zaproxy/zaproxy:stable',
        'docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t "$TARGET_URL" -m 1 -r zap_report.html || true',
      ],
      buildEnvironment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
    }));

    testStage.addPost(new ManualApprovalStep('ApproveTestIsGood', {
      comment: 'Approve if TEST and DAST look good. Then merge test → main.',
    }));
  }
}
