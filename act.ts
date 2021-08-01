import { mkdirSec, writeFileSec } from "./utils.ts";
import { Replacer, replacers } from "./replacers.ts";
import { settings } from "./settings.ts";
import { resolve, fromFileUrl } from "https://deno.land/std@0.103.0/path/mod.ts";

export async function act() {
  if (settings.path !== ".") {
    await mkdirSec(settings.path, { force: settings.force });
  }

  let p: string;
  try {
    p = fromFileUrl(import.meta.url);
  } catch(_err) {
    p = import.meta.url
  }

  const o = resolve(p, "../", "templates/", settings.path);
  
  // const base = `./${settings.templateDir}/${settings.template}`;

  const source = await Deno.realPath(o);

  const target = await Deno.realPath(settings.path);

  await processTemplateDir(source, target);

  if (settings.map === true) {
    await writeFileSec(
      settings.path + "/import_map.json",
      settings.mapContent,
    );
  }

  if (settings.git === true) {
    await initGit(settings.path);
  }

  if (settings.cache === true) {
    await runCommand(Deno.run({
      cmd: [
        "deno",
        "cache",
        "--quiet",
        "--reload",
        settings.path + "/" + settings.depsEntrypoint,
        settings.path + "/" + settings.devDepsEntrypoint,
      ],
    }));
  }
}

/** Recursively replace all template syntax into valid JavaScript/TypeScript in all template files. */
export async function processTemplateDir(dir: string, target: string) {
  for await (const entry of Deno.readDir(dir)) {
    const sourcePath = `${dir}/${entry.name}`;
    const targetPath = `${target}/${entry.name}`;

    if (entry.isDirectory) {
      await mkdirSec(targetPath, { recursive: true, force: settings.force });

      await processTemplateDir(sourcePath, targetPath);
    } else if (entry.isFile) {
      const file = new TextDecoder().decode(
        await Deno.readFile(sourcePath),
      );

      const data = new TextEncoder().encode(
        processTemplateFile(file, replacers),
      );

      await writeFileSec(validateFile(entry, targetPath), data);
    }
  }
}

function validateFile(entry: Deno.DirEntry, targetPath: string): string {
  const mod = /\bmod$/;
  const deps = /(?<!dev_|\w)deps$/;
  const devDeps = /\bdev_deps$/;
  const fileExtension = /\.(?:js|ts)$/;

  if (mod.test(entry.name)) {
    targetPath = targetPath.replace(mod, settings.entrypoint);
  } else if (deps.test(entry.name)) {
    targetPath = targetPath.replace(deps, settings.depsEntrypoint);
  } else if (devDeps.test(entry.name)) {
    targetPath = targetPath.replace(devDeps, settings.devDepsEntrypoint);
  }

  if (!fileExtension.test(targetPath)) {
    targetPath = targetPath + "." + settings.extension;
  }

  return targetPath;
}

function processTemplateFile(file: string, replacers: Replacer[]): string {
  for (const replacer of replacers) {
    file = file.replace(replacer.pattern, replacer.fn);
  }

  return file;
}

async function initGit(path: string) {
  try {
    await runCommand(Deno.run({
      cmd: ["git", "init", path],
    }));
  } catch (error) {
    console.warn(
      "Warning: Could not initialize Git repository. Error:" + error,
    );
  }

  await writeFileSec(
    settings.path + "/" + settings.gitignore,
    settings.gitignoreContent,
  );
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
