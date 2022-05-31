import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployParameterECSService(setting, skipGuided) {
  if (!setting?.ParameterECSService) {
    setting.ParameterECSService = {};
  }
  console.log("\n>> Parameters ECS Service");
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
          initial: setting.ParameterECSService.DesiredCount || 1,
        },
        {
          type: "number",
          name: "MaxCount",
          message:
            "Maximum number of instances of this task we can run across our cluster",
          initial: setting.ParameterECSService.MaxCount || 100,
        },
        {
          type: "number",
          name: "ContainerPort",
          message:
            "The port on the container to associate with the load balancer",
          initial: setting.ParameterECSService.ContainerPort || 3000,
        },
        {
          type: "number",
          name: "TaskCPU",
          message: "Specify the amount of CPU to reserve for the task",
          initial: setting.ParameterECSService.TaskCPU || 2048,
        },
        {
          type: "number",
          name: "TaskMemory",
          message: "Specify the amount of memory to reserve for the task",
          initial: setting.ParameterECSService.TaskMemory || 4096,
        },
      ],
      { onCancel: () => process.exit(1) }
    );
    setting.ParameterECSService = { ...response };
    deployCfn("parameters-ecs-service", setting, response);
  } else {
    if (!setting.ParameterECSService.DesiredCount) {
      console.log("ParameterECSService.DesiredCount not found");
      process.exit(1);
    }
    if (!setting.ParameterECSService.MaxCount) {
      console.log("ParameterECSService.MaxCount not found");
      process.exit(1);
    }
    if (!setting.ParameterECSService.ContainerPort) {
      console.log("ParameterECSService.ContainerPort not found");
      process.exit(1);
    }
    if (!setting.ParameterECSService.TaskCPU) {
      console.log("ParameterECSService.TaskCPU not found");
      process.exit(1);
    }
    if (!setting.ParameterECSService.TaskMemory) {
      console.log("ParameterECSService.TaskMemory not found");
      process.exit(1);
    }
    deployCfn("parameters-ecs-service", setting, setting.ParameterECSService);
  }
}

export async function deleteParameterECSService(setting) {
  deleteCfn("parameters-ecs-service", setting);
}
