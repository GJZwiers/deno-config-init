import { Command, EnumType } from "./deps.ts";
import { writeFileOrWarn, mkdirOrWarn, hasFileExtension } from './utils.ts';
import { vsCodeDebugConfig } from './configs/debugconfig_vscode.ts';

const encoder = new TextEncoder();
const encodedModule = encoder.encode("export {};\n");

const defaults = {
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

const choices = new EnumType(["oak", "restful_oak"]);   // aleph, opine

await new Command()
    .type("choices", choices)
    .name("deno-init")
    .version("0.5.3")
    .description("Start a new Deno project with a single command")
    .option("-f, --force [force:boolean]", "Force overwrite of existing files/directories. Helpful to re-initialize but use with caution!")
    .option("-n, --name [name:string]", "Create the project in a new directory.")
    .option<{ choices: typeof choices }>(
        "-t, --template [template:string]",
        "Initialize the project with a template. Options: oak, restful_oak"
    )
    .option("-y, --yes [yes:boolean]", "Answer with 'y' to all prompts")
    .action(async ({ force, name, template, yes }: any) => {  
        if (yes === true) {
            if (name) {
                await mkdirOrWarn(name, force);
                Deno.chdir(name);
            }
            await fetchTemplate(template);
            await addContents(undefined, undefined, force);
        } 
        else {
            const ts = prompt("TypeScript? (y/n)", 'y');
            const isTypeScript = (ts === 'y' || ts === 'Y');
        
            if (!isTypeScript && template) {
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

            if (name) {
                await mkdirOrWarn(name, force);
                Deno.chdir(name);
            }
        
            await fetchTemplate(template);
            await addContents(entrypoint, depsEntrypoint, force);
        }
    })
    .parse(Deno.args);


async function addContents(entrypoint?: string, depsEntrypoint?: string, force: boolean = false) {  
    await writeFileOrWarn(entrypoint ?? defaults.entrypoint, defaults.module, force);

    await writeFileOrWarn(depsEntrypoint ?? defaults.depsEntrypoint, defaults.depsModule, force);

    await writeFileOrWarn(defaults.gitignore, defaults.gitignorePatterns, force);

    await mkdirOrWarn(defaults.settingsDir, force);
    Deno.chdir(defaults.settingsDir);

    await writeFileOrWarn(defaults.settingsFile, defaults.settings, force);
    
    if (defaults.debug === 'y' || defaults.debug === 'Y') {
        await writeFileOrWarn(defaults.debugFile, defaults.debugConfig, force);
    }
}

async function fetchTemplate(t: string | undefined) { 
    if (t) {
        const template = await import(`./templates/${t}.${defaults.extension}`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, defaults.extension));
        defaults.depsModule = encoder.encode(template.deps);
    }
}

export { defaults }
