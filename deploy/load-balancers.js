import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deployLB(setting, skipGuided) {
  if (!setting?.LoadBalancers) {
    setting.LoadBalancers = {};
  }
  console.log("\n>> Load balancers");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    const response = await prompts(
      [
        {
          type: "number",
          name: "AppPort",
          message: "What's your application port?",
          initial: setting.LoadBalancers.AppPort || "3000",
        },
        {
          type: "text",
          name: "HealthCheckPath",
          message: "What's your health check path?",
          initial: setting.LoadBalancers.HealthCheckPath || "/api/health-check",
        },
      ],
      { onCancel: () => process.exit(1) }
    );
    setting.LoadBalancers = { ...response };
    deployCfn("load-balancers", setting, response);
  } else {
    if (!setting.LoadBalancers.AppPort) {
      console.log("LoadBalancers.AppPort not found");
      process.exit(1);
    }
    if (!setting.LoadBalancers.HealthCheckPath) {
      console.log("LoadBalancers.HealthCheckPath not found");
      process.exit(1);
    }
    deployCfn("load-balancers", setting, setting.LoadBalancers);
  }
}

export async function deleteLB(setting) {
  deleteCfn("load-balancers", setting);
}
