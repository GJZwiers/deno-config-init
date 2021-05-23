import { ArgumentsParser } from './deps.ts';
import { writeFileOrWarn, mkdirOrWarn, validateFilename } from './utils.ts';

const parser = new ArgumentsParser({
    force: {
        names: ["-f", "--force"],
        parser: Boolean,
        isFlag: true,
    },
    name: {
        names: ["-n", "--name"],
        parser: String,
    },
    template: {
        names: ["-t", "--template"],
        parser: String,
        choices: ["oak", "restful_oak"],
    },
    yes: {
        names: ["-y", "--yes"],
        parser: Boolean,
        isFlag: true,
    },
});

const encoder = new TextEncoder();

export const args = parser.parseArgs();

const defaultDebugConfig = `{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Deno",
            "type": "node",
            "request": "launch",
            "cwd": "\${workspaceFolder}",
            "runtimeExecutable": "deno",
            "runtimeArgs": ["run", "--inspect-brk", "-A", "\${file}"],
            "port": 9229
        }
    ]
}`;

const encodedModule = encoder.encode("export {};\n");

const defaults = {
    entrypoint: "mod.ts",
    debugConfig: encoder.encode(defaultDebugConfig),
    depsEntrypoint: "deps.ts",
    denoSettings: encoder.encode(`{\n\t"deno.enable": true\n}`),
    gitignore: ".gitignore",
    gitignoreContent: encoder.encode(".vscode/\n"),
    module: encodedModule,
    depsModule: encodedModule,
    settingsDir: ".vscode",
};

if (args.name) {
    await mkdirOrWarn(args.name);
    Deno.chdir(args.name);
}

if (args.yes === true) {
    if (args.template) {
        const template = await import(`./templates/${args.template}.ts`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, "ts"));
        defaults.depsModule = encoder.encode(template.deps);
    }

    await writeFileOrWarn(defaults.entrypoint, defaults.module);
    await writeFileOrWarn(defaults.depsEntrypoint, defaults.depsModule);

    await writeFileOrWarn(defaults.gitignore, defaults.gitignoreContent);

    await mkdirOrWarn(defaults.settingsDir);

    Deno.chdir(defaults.settingsDir);

    await writeFileOrWarn("settings.json", defaults.denoSettings);
    await writeFileOrWarn("launch.json", defaults.debugConfig);
} 
else {
    const ts = prompt("Use TypeScript? (y/n)", 'y');
    const ext = (ts === 'y' || ts === 'Y') ? "ts" : "js";
    let entrypoint = prompt(`Entrypoint:`, `mod.${ext}`);
    let depsEntrypoint = prompt("Dependency entrypoint", `deps.${ext}`);
    const debug = prompt("Add debug configuration? (y/n)", 'y');

    if (!entrypoint) {
        throw new Error("Invalid entrypoint");
    }

    if (!depsEntrypoint) {
        throw new Error("Invalid dependency entrypoint");
    }

    // Allow user to input file without extension
    const isValidEntrypoint = validateFilename(entrypoint, ext);
    const isValidDepsEntrypoint = validateFilename(depsEntrypoint, ext);

    if (!isValidEntrypoint) {
        entrypoint = `${entrypoint}.${ext}`;
    }

    if (!isValidDepsEntrypoint) {
        depsEntrypoint = `${depsEntrypoint}.${ext}`;
    }

    // TODO: DRY
    if (args.template) {
        const template = await import(`./templates/${args.template}.ts`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, "ts"));
        defaults.depsModule = encoder.encode(template.deps);
    }

    await writeFileOrWarn(entrypoint, defaults.module);
    await writeFileOrWarn(`deps.${ext}`, defaults.depsModule);
    
    await mkdirOrWarn(defaults.settingsDir);
    await writeFileOrWarn(defaults.gitignore, defaults.gitignoreContent);

    Deno.chdir(defaults.settingsDir);

    await writeFileOrWarn("settings.json", defaults.denoSettings);
    
    if (debug === 'y' || debug === 'Y') {
        await writeFileOrWarn("launch.json", defaults.debugConfig);
    }

}
