// import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";

export async function deploySG(setting, skipGuided) {
  if (!setting?.SecurityGroups) {
    setting.SecurityGroups = {};
  }
  console.log("\n>> Security Groups");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    deployCfn("security-groups", setting, setting.SecurityGroups);
  } else {
    deployCfn("security-groups", setting, setting.SecurityGroups);
  }
}

export async function deleteSG(setting) {
  deleteCfn("security-groups", setting);
}
