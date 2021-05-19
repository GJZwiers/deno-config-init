export async function writeFileOrWarn(path: string | URL, data: Uint8Array, options?: Deno.WriteFileOptions | undefined)
    : Promise<void> {
    try {
        const file = await Deno.readFile(path);
        if (file) {
            console.warn(`Warning: file ${path} already exists. Pass --force to overwrite`);
        }
    } catch(error) {
        await Deno.writeFile(path, data, options);
    }
}

export async function mkDirOrWarn(path: string | URL, options?: Deno.WriteFileOptions | undefined)
    : Promise<void> {
    try {
        await Deno.mkdir(path, options);
    } catch(error) {
        console.warn(`Warning: Directory ${path} already exists. Pass --force to overwrite`);
    }
}
