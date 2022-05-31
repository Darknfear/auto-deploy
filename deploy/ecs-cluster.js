// import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployECSCluster(setting, skipGuided) {
  if (!setting?.ECSCluster) {
    setting.ECSCluster = {};
  }
  console.log("\n>> ECS Cluster");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    deployCfn("ecs-cluster", setting, setting.ECSCluster);
  } else {
    deployCfn("ecs-cluster", setting, setting.ECSCluster);
  }
}

export async function deleteECSCluster(setting) {
  deleteCfn("ecs-cluster", setting);
}
