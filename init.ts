import { Command } from "./deps.ts";
import { process } from "./processOptions.ts";
import { defaultOpts, inputHandler } from "./writeConfigFile.ts";

await new Command()
  .name("dci")
  .version("v2.6.7")
  .description("Generate a Deno configuration file.")
  .help({
    colors: (Deno.build.os === "windows") ? false : true,
  })
  .option(
    "-a, --fill [fill:boolean]",
    "Create the config file as .jsonc with the possible options listed as comments",
  )
  .option(
    "-b, --bench [bench:boolean]",
    "Add config for deno bench only. Requires Deno 1.29 or higher",
  )
  .option(
    "-c, --jsonc [jsonc:boolean]",
    "Create the config file as .jsonc. Alias for --fill",
  )
  .option(
    "-f, --force [force:boolean]",
    "Allow overwriting an existing config file",
  )
  .option(
    "-n, --name <name:string>",
    "Set a custom name for the config file",
  )
  .option(
    "-m, --fmt [fmt:boolean]",
    "Add config for deno fmt only",
  )
  .option(
    "-p, --map [map:boolean]",
    "Add config for an import map. Requires Deno 1.20 or higher",
  )
  .option(
    "-l, --lint [lint:boolean]",
    "Add config for deno lint only",
  )
  .option(
    "-o, --lock [lock:boolean]",
    "Enable or disable lock file generation",
  )
  .option(
    "-i, --lockfile <lockfile:string>",
    "Set a custom name for the lock file",
  )
  .option(
    "-k, --task [task:boolean]",
    "Add config for deno tasks only. Requires Deno 1.20 or higher",
  )
  .option(
    "-s, --test [test:boolean]",
    "Add config for deno test only. Requires Deno 1.24 or higher",
  )
  .option(
    "-t, --tsconfig [tsconfig:boolean]",
    "Add config for typescript compiler options only.",
  )
  .option(
    "-y, --yes [yes:boolean]",
    "Skip the prompts and use all defaults",
  )
  // deno-lint-ignore no-explicit-any
  .action(async (options: any) => {
    const processedOptions = process({ ...defaultOpts, ...options });
    await inputHandler(processedOptions);
  })
  .parse(Deno.args);
