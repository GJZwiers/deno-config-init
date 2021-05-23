# init

Start Deno projects in Visual Studio Code a little faster with `deno-init`, a small executable that scaffolds a Deno project structure for you.

> Please note this module's API is not yet stable and there may be breaking changes on `0.x` version increments.

## Prerequisites
- Deno
- Visual Studio Code
- Deno Language Extension for Visual Studio Code

## Installation
Latest:
```
deno install --allow-read --allow-net --allow-write -n deno-init https://deno.land/x/init/mod.ts
```
Specific version:
```
deno install --allow-read  --allow-net --allow-write -n deno-init https://deno.land/x/init@0.4.0/mod.ts
```

To upgrade the executable when it's already installed add `--reload` and `-f`:
```
deno install --allow-read --allow-net --allow-write --reload -f -n deno-init https://deno.land/x/init/mod.ts
```

## Basic Usage
You can run the command without specifying any options. This will prompt you for a few values:
* TypeScript? (default `y`)
* Entrypoint? (default `mod.ts`)
* Dependency entrypoint? (default `deps.ts`) 
* Add debug configuration? (default `y`).

```
deno-init
```

Choosing all defaults will create the following structure in the current directory:
```
.
│   .gitignore
│   deps.ts  
│   mod.ts
│
└───.vscode
│   │   launch.json
│   │   settings.json
```

The generated `.gitignore` will include `.vscode` and `launch.json` as well as `settings.json` will contain the necessary setup.

## Available Options
If you simply want to use all the default values without being prompted you can pass `--yes` or `-y`. Note that `deno-init` will not overwrite anything by default in case you already made some of the files/directories:
```
deno-init -y
```

In case you explicitly want to overwrite existing files you can pass `--force` or `-f`:
```
deno-init -f
```

When you run the command with `--name` or `-n` the script will create a new directory and the add the files in there instead of the current directory:
```
deno-init -n myDenoProject
```

`deno-init` will also provide some templates to get started with various deno frameworks. This is still being worked on but you can already initialize a very basic `oak` project right now:
```
deno-init --template oak
```
