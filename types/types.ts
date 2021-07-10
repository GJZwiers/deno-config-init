
type CLIOption = string | undefined;

type EditorConfig = {
  debugFile: string;
  debugFileContent: Uint8Array;
  gitignoreContent: Uint8Array;
  settings: Uint8Array;
  settingsDir: string;
  settingsFile: string;
};

type EditorConfigs = {
  [key: string]: EditorConfig;
};

export type { CLIOption, EditorConfig, EditorConfigs }
