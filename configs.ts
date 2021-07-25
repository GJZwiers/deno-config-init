import { vsCodeDebugConfig } from "./configs/debugconfig_vscode.ts";
import { EditorConfigs } from "./types/types.ts";

const encoder = new TextEncoder();

export const editorConfigs: EditorConfigs = {
  "vscode": {
    debugFileContent: encoder.encode(vsCodeDebugConfig),
    debugFile: "launch.json",
    gitignoreContent: encoder.encode(".vscode/\n"),
    settingsDir: ".vscode",
    settingsFile: "settings.json",
    settings: encoder.encode(`{\n\t"deno.enable": true\n}`),
  },
};
