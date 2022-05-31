// import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployECR(setting, skipGuided) {
  if (!setting?.ECR) {
    setting.ECR = {};
  }
  console.log("\n>> ECR");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    deployCfn("ecr", setting, setting.ECR);
  } else {
    deployCfn("ecr", setting, setting.ECR);
  }
}

export async function deleteECR(setting) {
  deleteCfn("ecr", setting);
}
