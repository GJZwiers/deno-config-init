export interface Options {
  bench: boolean;
  force: boolean;
  fill: boolean;
  fmt: boolean;
  jsonc: boolean;
  lint: boolean;
  lock: boolean;
  lockfile: string;
  map: boolean;
  name: string;
  task: boolean;
  test: boolean;
  tsconfig: boolean;
  yes: boolean;
}

export type ConfigFile = {
  compilerOptions?: Record<string, unknown>;
  fmt?: {
    files?: {
      include?: string[];
      exclude?: string[];
    };
    options?: Record<string, unknown>;
  };
  lint?: {
    files?: {
      include?: string[];
      exclude?: string[];
    };
    rules?: {
      tags?: string[];
      include?: string[];
      exclude?: string[];
    };
  };
  tasks?: Record<string, unknown>;
  test?: {
    files?: {
      include: string[];
      exclude: string[];
    };
  };
  bench?: {
    files?: {
      include: string[];
      exclude: string[];
    };
  };
  importMap?: string;
  lock?: boolean | string;
};

export interface WriteFileSecOptions extends Deno.WriteFileOptions {
  force?: boolean;
}

export type FeatureVersions = {
  [key: string]: {
    major: number;
    minor: number;
  };
};

export interface PromptAnswerOptions {
  testmode: boolean;
}
