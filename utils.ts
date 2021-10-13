import { settings } from "./settings.ts";

export interface MkdirSecOptions extends Deno.MkdirOptions {
  force?: boolean;
}

/**
 * Attempts to write to a file, but warns instead of overwriting if it exists already.
 */
async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: Deno.WriteFileOptions,
): Promise<void> {
  if (settings.force) {
    return await Deno.writeFile(path, data, options);
  }

  try {
    const file = await Deno.readFile(path);
    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Pass --force to overwrite.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}

/**
 * Attempts to make a directory, but warns instead of throwing if it exists already.
 */
async function mkdirSec(
  path: string | URL,
  options?: MkdirSecOptions,
): Promise<boolean> {
  try {
    // throws if dir exists
    await Deno.mkdir(path, options);

    return true;
  } catch (_error) {
    if (options?.force) return true;

    console.warn(
      `Warning: Directory ${path} already exists.`,
    );

    return false;
  }
}

function hasFileExtension(filename: string, extension: string): boolean {
  return new RegExp(`\.${extension}$`).test(filename);
}

export { hasFileExtension, mkdirSec, writeFileSec };
