import { settings } from "./settings.ts";

export interface Replacer {
  pattern: RegExp;
  fn: (match: string, group1: string, type: string) => string;
}

export const replacers: Replacer[] = [
  {
    pattern: /(?<!\\)\{\{extension\}\}/g,
    fn: (_match: string): string => {
      return settings.extension;
    },
  },
  {
    pattern: /\s?\{\{type(:)\s?([A-Za-z0-9_]*?)\}\}/g,
    fn: (_match: string, group1: string, type: string): string => {
      return (settings.extension === "ts") ? group1 + " " + type : "";
    },
  },
  {
    pattern: /``ts\n(.*?)\n``ts/gs,
    fn: (_match: string, content: string): string => {
      return (settings.extension === "ts") ? content : "";
    },
  },
  {
    pattern: /(?<!\\)\{\{mod:(public|private|protected)\}\}/g,
    fn: (_match: string, modifier: string): string => {
      return (settings.extension === "ts") ? modifier : "";
    },
  },
];
