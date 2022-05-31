import prompts from "prompts";
import {
  checkEnv,
  checkAwsProfile,
  checkAwsRegion,
  checkSuffixes,
} from "./deploy/common.js";
import { getSetting } from "./setting.js";
import { deployVPC, deleteVPC } from "./deploy/vpc.js";
import { deleteSG, deploySG } from "./deploy/security-groups.js";
import { deleteLB, deployLB } from "./deploy/load-balancers.js";
import { deleteECR, deployECR } from "./deploy/ecr.js";
import { deleteECSCluster, deployECSCluster } from "./deploy/ecs-cluster.js";
import { deleteEC2, deployEC2 } from "./deploy/ec2.js";
import { deleteECSService, deployECSService } from "./deploy/ecs-service.js";
import {
  deleteS3,
  deployS3,
  pushCustomBatch,
  pushEcsService,
} from "./deploy/s3.js";
import { deleteParameterECSService, deployParameterECSService } from "./deploy/parameters-ecs-service.js";

async function deploy(setting) {
  const response = await prompts([
    {
      type: "select",
      name: "skipGuided",
      message: "Do you want to skip the guided?",
      choices: [
        {
          title: "Yes",
          value: "Y",
          selected: true,
        },
        {
          title: "No",
          value: "N",
        },
      ],
    },
  ]);
  const skipGuided = response.skipGuided === "Y";
  await deployVPC(setting, skipGuided);
  await deployS3(setting, skipGuided);
  await pushEcsService(setting);
  await pushCustomBatch(setting);
  await deployECSCluster(setting, skipGuided);
  await deploySG(setting, skipGuided);
  await deployLB(setting, skipGuided);
  await deployECR(setting, skipGuided);
  await deployParameterECSService(setting, skipGuided);
  await deployEC2(setting, skipGuided);
}

const optionStack = [
  {
    type: "select",
    name: "option",
    message: "Pick one option!",
    choices: [
      {
        title: "Deploy",
        value: "deploy",
        description: "Deploy stack",
      },
      {
        title: "Delete stack",
        value: "delete",
        description: "Delete stack",
      },
    ],
  },
];

async function main() {
  const setting = getSetting() || {};
  await checkEnv(setting);
  await checkAwsProfile(setting);
  await checkAwsRegion(setting);
  await checkSuffixes(setting);
  const response = await prompts([
    {
      type: "select",
      name: "stack",
      message: "Pick one stack!",
      choices: [
        { title: "Deploy", value: "deploy", description: "Deploy all stack" },
        { title: "Vpc", value: "vpc", description: "Manager Vpc stack" },
        {
          title: "S3",
          value: "s3",
          description: "Manager S3 template",
        },
        {
          title: "Security Groups",
          value: "sg",
          description: "Manager Security stack",
        },
        {
          title: "Load Balancers",
          value: "lb",
          description: "Manager Load balancers",
        },
        {
          title: "Elastic Container Registry",
          value: "ecr",
          description: "Manager ECR",
        },
        {
          title: "ECS Cluster",
          value: "ecs-cluster",
          description: "Manager ECS Cluster",
        },
        {
          title: "EC2",
          value: "ec2",
          description: "Manager EC2 for deploy, CICD, manager database",
        },
        {
          title: "Parameters ECS Service",
          value: "parameters-ecs-service",
          description: "Deploy parameter ECS Service",
        },
        {
          title: "ECS Service",
          value: "ecs-service",
          description: "Manager ECS Service",
        },
      ],
    },
  ]);
  switch (response.stack) {
    case "deploy":
      await deploy(setting);
      break;

    case "vpc":
      vpc(setting);
      break;

    case "sg":
      securityGroups(setting);
      break;

    case "lb":
      loadbalancers(setting);
      break;

    case "ecr":
      ecr(setting);
      break;

    case "ecs-cluster":
      ecsCluster(setting);
      break;

    case "ec2":
      ec2(setting);
      break;

    case "parameters-ecs-service":
      parametersEcsService(setting);
      break;

    case "ecs-service":
      ecsService(setting);
      break;

    case "s3":
      s3(setting);
      break;

    default:
      break;
  }
}

async function managerStack(deployHandler, deleteHandler, optStack) {
  if (!optStack) {
    optStack = optionStack;
  }
  const response = await prompts(optStack);
  switch (response.option) {
    case "deploy":
      const response1 = await prompts([
        {
          type: "select",
          name: "skipGuided",
          message: "Do you want to skip the guided?",
          choices: [
            {
              title: "Yes",
              value: "Y",
              selected: true,
            },
            {
              title: "No",
              value: "N",
            },
          ],
        },
      ]);
      await deployHandler.call(this, response1.skipGuided === "Y");
      break;

    case "delete":
      await deleteHandler();
      break;

    default:
      optStack?.[0]?.choices?.forEach((c) => {
        if (c.value === response.option) {
          c.handler?.call(this);
        }
      });
  }
}

async function vpc(setting) {
  await managerStack(
    deployVPC.bind(this, setting),
    deleteVPC.bind(this, setting)
  );
}

async function securityGroups(setting) {
  await managerStack(
    deploySG.bind(this, setting),
    deleteSG.bind(this, setting)
  );
}

async function loadbalancers(setting) {
  await managerStack(
    deployLB.bind(this, setting),
    deleteLB.bind(this, setting)
  );
}

async function ecr(setting) {
  await managerStack(
    deployECR.bind(this, setting),
    deleteECR.bind(this, setting)
  );
}

async function ecsCluster(setting) {
  await managerStack(
    deployECSCluster.bind(this, setting),
    deleteECSCluster.bind(this, setting)
  );
}

async function ec2(setting) {
  await managerStack(
    deployEC2.bind(this, setting),
    deleteEC2.bind(this, setting)
  );
}

async function parametersEcsService(setting) {
  await managerStack(
    deployParameterECSService.bind(this, setting),
    deleteParameterECSService.bind(this, setting)
  );
}

async function ecsService(setting) {
  await managerStack(
    deployECSService.bind(this, setting),
    deleteECSService.bind(this, setting)
  );
}

async function s3(setting) {
  const opts = Object.assign({}, optionStack[0], {
    choices: [
      ...optionStack[0].choices,
      {
        title: "Put ecs-service.yaml",
        value: "put-ecs-service",
        description: "Put ecs-service.yaml",
        handler: pushEcsService.bind(this, setting),
      },
      {
        title: "Put custom-bash.sh",
        value: "put-custom-bash",
        description: "Put custom-bash.sh",
        handler: pushCustomBatch.bind(this, setting),
      },
    ],
  });
  await managerStack(
    deployS3.bind(this, setting),
    deleteS3.bind(this, setting),
    [opts]
  );
}

main();
