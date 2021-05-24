import { args } from './parser.ts';
import { writeFileOrWarn, mkdirOrWarn, hasFileExtension } from './utils.ts';
import { vsCodeDebugConfig } from './configs/debugconfig_vscode.ts';

const encoder = new TextEncoder();
const encodedModule = encoder.encode("export {};\n");

export const defaults = {
    debug: 'y',
    debugConfig: encoder.encode(vsCodeDebugConfig),
    debugFile: "launch.json",
    depsEntrypoint: "deps.ts",
    entrypoint: "mod.ts",
    extension: "ts",
    gitignore: ".gitignore",
    gitignorePatterns: encoder.encode(".vscode/\n"),
    module: encodedModule,
    depsModule: encodedModule,
    settings: encoder.encode(`{\n\t"deno.enable": true\n}`),
    settingsDir: ".vscode",
    settingsFile: "settings.json",
};

async function checkTemplateArg() {   
    if (args.template) {
        const template = await import(`./templates/${args.template}.${defaults.extension}`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, defaults.extension));
        defaults.depsModule = encoder.encode(template.deps);
    }
}

async function addContents(entrypoint?: string, depsEntrypoint?: string) {  
    await writeFileOrWarn(entrypoint ?? defaults.entrypoint, defaults.module);
    await writeFileOrWarn(depsEntrypoint ?? defaults.depsEntrypoint, defaults.depsModule);
    await writeFileOrWarn(defaults.gitignore, defaults.gitignorePatterns);

    await mkdirOrWarn(defaults.settingsDir);
    Deno.chdir(defaults.settingsDir);

    await writeFileOrWarn(defaults.settingsFile, defaults.settings);
    
    if (defaults.debug === 'y' || defaults.debug === 'Y') {
        await writeFileOrWarn(defaults.debugFile, defaults.debugConfig);
    }
}

if (args.name) {
    await mkdirOrWarn(args.name);
    Deno.chdir(args.name);
}

if (args.yes === true) {
    await checkTemplateArg();
    await addContents();
} 
else {
    const ts = prompt("TypeScript? (y/n)", 'y');
    const isTypeScript = (ts === 'y' || ts === 'Y');

    if (!isTypeScript && args.template) {
        console.warn("Warning: Selected JavaScript with a TypeScript template.");
    }

    const extension = isTypeScript ? defaults.extension : "js";

    let entrypoint = <string> prompt(`Entrypoint:`, `mod.${extension}`);

    if (!hasFileExtension(entrypoint, extension)) {
        entrypoint = `${entrypoint}.${extension}`;
    }

    let depsEntrypoint = <string> prompt("Dependency entrypoint", `deps.${extension}`);

    if (!hasFileExtension(depsEntrypoint, extension)) {
        depsEntrypoint = `${depsEntrypoint}.${extension}`;
    }

    const addDebug = <string> prompt("Add debug configuration? (y/n)", defaults.debug);
    
    if (addDebug !== 'y' && addDebug !== 'Y') {
        defaults.debug = addDebug;
    }

    await checkTemplateArg();
    await addContents(entrypoint, depsEntrypoint);
}
