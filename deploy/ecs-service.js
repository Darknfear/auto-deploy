import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployECSService(setting, skipGuided) {
  if (!setting?.ECSService) {
    setting.ECSService = {};
  }
  console.log("\n>> ECS Service");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    const response = await prompts(
      [
        {
          type: "number",
          name: "DesiredCount",
          message:
            "How many instances of this task should we run across our cluster?",
          initial: setting.ECSService.DesiredCount || 1,
        },
        {
          type: "number",
          name: "MaxCount",
          message:
            "Maximum number of instances of this task we can run across our cluster",
          initial: setting.ECSService.MaxCount || 100,
        },
        {
          type: "number",
          name: "ContainerPort",
          message:
            "The port on the container to associate with the load balancer",
          initial: setting.ECSService.ContainerPort || 3000,
        },
      ],
      { onCancel: () => process.exit(1) }
    );
    setting.ECSService = { ...response };
    deployCfn("ecs-service", setting, response);
  } else {
    if (!setting.ECSService.DesiredCount) {
      console.log("ECSService.DesiredCount not found");
      process.exit(1);
    }
    if (!setting.ECSService.MaxCount) {
      console.log("ECSService.MaxCount not found");
      process.exit(1);
    }
    if (!setting.ECSService.ContainerPort) {
      console.log("ECSService.ContainerPort not found");
      process.exit(1);
    }
    deployCfn("ecs-service", setting, setting.ECSService);
  }
}

export async function deleteECSService(setting) {
  deleteCfn("ecs-service", setting);
}
