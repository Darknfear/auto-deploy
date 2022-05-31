import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployEC2(setting, skipGuided) {
  if (!setting?.EC2) {
    setting.EC2 = {};
  }
  console.log("\n>> EC2");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    const response = await prompts(
      [
        {
          type: "text",
          name: "InstanceType",
          message: "What's your ec2 instance type?",
          initial: setting.EC2.InstanceType || "t2.micro",
        },
        {
          type: "text",
          name: "ImageId",
          message: "What's your ec2 imageId?",
          initial: setting.EC2.ImageId,
        },
        {
          type: "text",
          name: "KeyPair",
          message: "What's your name of .pem file for ssh?",
          initial: setting.EC2.KeyPair,
        },
        {
          type: "text",
          name: "GitlabHost",
          message: "What's your host url of gitlab?",
          initial: setting.EC2.GitlabHost || "https://git.amela.vn/",
        },
        {
          type: "text",
          name: "GitlabRegistrationToken",
          message: "What's your gitlab runner registration token?",
          initial: setting.EC2.GitlabRegistrationToken,
        },
        {
          type: "text",
          name: "GitlabRunnerTag",
          message: "What's your gitlab runner tag?",
          initial: setting.EC2.GitlabRunnerTag || "production-runner",
        },
        {
          type: "text",
          name: "FolderWorkspace",
          message: "What's your workspace for deploy?",
          initial: setting.EC2.FolderWorkspace || "server",
        },
      ],
      { onCancel: () => process.exit(1) }
    );
    setting.EC2 = { ...response };
    deployCfn("ec2", setting, response);
  } else {
    if (!setting.EC2.InstanceType) {
      console.log("EC2.InstanceType not found");
      process.exit(1);
    }
    if (!setting.EC2.ImageId) {
      console.log("EC2.ImageId not found");
      process.exit(1);
    }
    if (!setting.EC2.KeyPair) {
      console.log("EC2.KeyPair not found");
      process.exit(1);
    }
    if (!setting.EC2.GitlabHost) {
      console.log("EC2.GitlabHost not found");
      process.exit(1);
    }
    if (!setting.EC2.GitlabRegistrationToken) {
      console.log("EC2.GitlabRegistrationToken not found");
      process.exit(1);
    }
    if (!setting.EC2.GitlabRunnerTag) {
      console.log("EC2.GitlabRunnerTag not found");
      process.exit(1);
    }
    if (!setting.EC2.FolderWorkspace) {
      console.log("EC2.FolderWorkspace not found");
      process.exit(1);
    }
    deployCfn("ec2", setting, setting.EC2);
  }
}

export async function deleteEC2(setting) {
  deleteCfn("ec2", setting);
}
