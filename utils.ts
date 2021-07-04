
async function writeFileOrWarn(path: string | URL, data: Uint8Array, force = false)
    : Promise<void> {
    if (force) {
        return await Deno.writeFile(path, data);
    }

    try {
        const file = await Deno.readFile(path);
        if (file) {
            console.warn(`Warning: file ${path} already exists. Pass --force to overwrite`);
        }
    } catch(_error) {
        await Deno.writeFile(path, data);
    }
}

async function mkdirOrWarn(path: string | URL, force = false)
    : Promise<void> {
    try {
        await Deno.mkdir(path);
    } catch(_error) {
        if (force) return;
        console.warn(`Warning: Directory ${path} already exists.`);
    }
}

function hasFileExtension(filename: string, extension: string): boolean {
    return new RegExp(`^[_A-Za-z-]+\.${extension}$`).test(filename);
}

export { writeFileOrWarn, mkdirOrWarn, hasFileExtension }
