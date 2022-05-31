// import prompts from "prompts";
import { deployCfn, deleteCfn } from "./common.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function deployS3(setting, skipGuided) {
  if (!setting?.S3) {
    setting.S3 = {};
  }
  console.log("\n>> S3");
  if (!setting.EnvironmentName) {
    console.log(`>> Environment name is not define!`);
    return;
  }
  if (!skipGuided) {
    deployCfn("s3", setting, setting.S3);
  } else {
    deployCfn("s3", setting, setting.S3);
  }
}

export function deleteS3(setting) {
  console.log(`Empty bucket ${setting.EnvironmentName}-template`);
  execSync(
    `aws s3 rm s3://${setting.EnvironmentName}-template --recursive --profile ${
      setting.AwsProfile || setting.EnvironmentName
    }`,
    { stdio: "inherit" }
  );
  deleteCfn("s3", setting);
}

function pushFile(setting, file) {
  const templateFile = join(__dirname, "../", `templates/${file}`);

  const commandLineExec = `aws s3 cp ${templateFile} s3://${
    setting.EnvironmentName
  }-template/${file} --profile ${
    setting.AwsProfile || setting.EnvironmentName
  }`;

  console.log(
    `Uploading ${file} -> ${setting.EnvironmentName}-template Bucket`
  );
  execSync(commandLineExec, { stdio: "inherit" });
  console.log(`Upload successfully!`);
}

export function pushEcsService(setting) {
  return pushFile(setting, "ecs-service.yaml");
}

export function pushCustomBatch(setting) {
  return pushFile(setting, "custom-bash.sh");
}
