import prompts from "prompts";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { writeSetting } from "../setting.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function checkEnv(setting) {
  const response = await prompts(
    [
      {
        type: "text",
        name: "EnvironmentName",
        message: `What's your environment name?`,
        initial: setting?.EnvironmentName,
      },
    ],
    { onCancel: () => process.exit(1) }
  );
  const { EnvironmentName } = response;
  if (!setting.EnvironmentName || EnvironmentName !== setting.EnvironmentName) {
    setting.EnvironmentName = EnvironmentName;
    writeSetting(setting);
  }

  return setting.EnvironmentName;
}

export async function checkAwsProfile(setting) {
  const response = await prompts(
    [
      {
        type: "text",
        name: "AwsProfile",
        message: `What's your aws profile?`,
        initial: setting?.AwsProfile || setting?.EnvironmentName,
      },
    ],
    { onCancel: () => process.exit(1) }
  );
  const { AwsProfile } = response;
  if (!setting.AwsProfile || AwsProfile !== setting.AwsProfile) {
    setting.AwsProfile = AwsProfile;
    writeSetting(setting);
  }

  return setting.AwsProfile;
}

export async function checkAwsRegion(setting) {
  const response = await prompts(
    [
      {
        type: "text",
        name: "Region",
        message: `What's your aws region?`,
        initial: setting?.Region || "ap-northeast-1",
      },
    ],
    { onCancel: () => process.exit(1) }
  );
  const { Region } = response;
  if (!setting.Region || Region !== setting.Region) {
    setting.Region = Region;
    writeSetting(setting);
  }

  return setting.AwsProfile;
}

export async function checkSuffixes(setting) {
  const response = await prompts(
    [
      {
        type: "text",
        name: "Suffixes",
        message: `What's your Suffixes?`,
        initial: setting?.Suffixes || 'api',
      },
    ],
    { onCancel: () => process.exit(1) }
  );
  const { Suffixes } = response;
  if (!setting.Suffixes || Suffixes !== setting.Suffixes) {
    setting.Suffixes = Suffixes;
    writeSetting(setting);
  }

  return setting.AwsProfile;
}

const skipSuffixes = ["ecs-cluster", "s3", "security-groups", "vpc"];

export function deployCfn(templateName, setting, inputCmd) {
  const templateFile = join(__dirname, "../", `templates/${templateName}.yaml`);
  const skipSuff = skipSuffixes.includes(templateName);
  if (!skipSuff && !setting.Suffixes) {
    console.log("setting.Suffixes is not define");
    process.exit(1);
  }
  const stackName = `${setting.EnvironmentName}-${templateName}${
    !skipSuff ? "-" + setting.Suffixes : ""
  }`;
  const commandLineExec = `aws cloudformation deploy --template-file ${templateFile} --stack-name ${stackName} --capabilities CAPABILITY_NAMED_IAM --region ${
    setting.Region || "ap-northeast-1"
  } --profile ${
    setting.AwsProfile || setting.EnvironmentName
  } --parameter-overrides EnvironmentName="${
    setting.EnvironmentName
  }"${getEnviromentsCfn(inputCmd)}`;

  //   console.log(`excute`, commandLineExec);
  console.log(`Deploying ${setting.EnvironmentName}-${templateName}`);
  execSync(commandLineExec, { stdio: "inherit" });
  writeSetting(setting);
  console.log(
    `Deploy ${setting.EnvironmentName}-${templateName} successfully!`
  );
}

export function deleteCfn(templateName, setting) {
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  const skipSuff = skipSuffixes.includes(templateName);
  if (!skipSuff && !setting.Suffixes) {
    console.log("setting.Suffixes is not define");
    process.exit(1);
  }
  const stackName = `${setting.EnvironmentName}-${templateName}${
    !skipSuff ? "-" + setting.Suffixes : ""
  }`;
  const commandLineExec = `aws cloudformation delete-stack --stack-name ${stackName} --region ${
    setting.Region || "ap-northeast-1"
  } --profile ${setting.AwsProfile || setting.EnvironmentName}`;
  //   console.log(`excute`, commandLineExec);
  console.log(`Delete ${setting.EnvironmentName}-${templateName}`);
  execSync(commandLineExec, { stdio: "inherit" });
  console.log(
    `The deletion ${setting.EnvironmentName}-${templateName} process takes a few minutes, please follow cloudformation console`
  );
}

export function getEnviromentsCfn(data) {
  if (!data) return "";
  let res = "";
  for (const key of Object.keys(data)) {
    res += ` ${key}=${data[key]}`;
  }
  return res;
}
