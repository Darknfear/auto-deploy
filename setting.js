import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getSetting() {
  try {
    const setting = readFileSync(join(__dirname, "setting.json"));
    if (!setting) return;
    return JSON.parse(setting.toString());
  } catch (error) {
    return;
  }
}

export function writeSetting(setting) {
  writeFileSync(
    join(__dirname, "setting.json"),
    JSON.stringify(setting, null, 4)
  );
}
