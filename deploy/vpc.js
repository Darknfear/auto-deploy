import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployVPC(setting, skipGuided) {
  if (!setting?.Vpc) {
    setting.Vpc = {};
  }
  console.log("\n>> VPC");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    const response = await prompts(
      [
        {
          type: "text",
          name: "VpcCIDR",
          message: "What's your Vpc CIDR?",
          initial: setting.Vpc.VpcCIDR || "10.180.0.0/16",
        },
        {
          type: "text",
          name: "PublicSubnet1CIDR",
          message: "What's your public subnet 1?",
          initial: setting.Vpc.PublicSubnet1CIDR || "10.180.8.0/21",
        },
        {
          type: "text",
          name: "PublicSubnet2CIDR",
          message: "What's your public subnet 2?",
          initial: setting.Vpc.PublicSubnet2CIDR || "10.180.16.0/21",
        },
        {
          type: "text",
          name: "PublicSubnet3CIDR",
          message: "What's your public subnet 3?",
          initial: setting.Vpc.PublicSubnet3CIDR || "10.180.24.0/21",
        },
        {
          type: "text",
          name: "PrivateSubnet1CIDR",
          message: "What's your private subnet 1?",
          initial: setting.Vpc.PrivateSubnet1CIDR || "10.180.32.0/21",
        },
        {
          type: "text",
          name: "PrivateSubnet2CIDR",
          message: "What's your private subnet 2?",
          initial: setting.Vpc.PrivateSubnet2CIDR || "10.180.40.0/21",
        },
        {
          type: "text",
          name: "PrivateSubnet3CIDR",
          message: "What's your private subnet 3?",
          initial: setting.Vpc.PrivateSubnet3CIDR || "10.180.48.0/21",
        },
      ],
      { onCancel: () => process.exit(1) }
    );
    setting.Vpc = { ...response };
    deployCfn("vpc", setting, response);
  } else {
    if (!setting.Vpc.VpcCIDR) {
      console.log("Vpc.VpcCIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PublicSubnet1CIDR) {
      console.log("Vpc.PublicSubnet1CIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PublicSubnet2CIDR) {
      console.log("Vpc.PublicSubnet2CIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PublicSubnet3CIDR) {
      console.log("Vpc.PublicSubnet3CIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PrivateSubnet1CIDR) {
      console.log("Vpc.PrivateSubnet1CIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PrivateSubnet2CIDR) {
      console.log("Vpc.PrivateSubnet2CIDR not found");
      process.exit(1);
    }
    if (!setting.Vpc.PrivateSubnet3CIDR) {
      console.log("Vpc.PrivateSubnet3CIDR not found");
      process.exit(1);
    }
    deployCfn("vpc", setting, setting.vpc);
  }
}

export async function deleteVPC(setting) {
  deleteCfn("vpc", setting);
}
