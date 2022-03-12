export interface WriteFileSecOptions extends Deno.WriteFileOptions {
  force?: boolean;
}

export async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: WriteFileSecOptions,
): Promise<void> {
  if (options?.force) {
    return await Deno.writeFile(path, data, options);
  }

  try {
    const file = await Deno.readFile(path);

    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Use --force if you want to overwrite an existing file.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}
