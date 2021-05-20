# Init

Start Deno projects in Visual Studio Code a little faster with `deno-init`, a small executable that scaffolds a Deno project structure for you.

Select a language (js/ts), entrypoint and optionally a debug configuration.

Please note this module's API is not yet stable and there may be breaking changes on `0.x` version increments.

## Prerequisites
- Deno
- Visual Studio Code
- Deno Language Extension for Visual Studio Code

## Installation
Latest:
```
deno install --allow-read --allow-write -n deno-init https://deno.land/x/init/init.ts
```
Specific version:
```
deno install --allow-read --allow-write -n deno-init https://deno.land/x/init@0.4.0/init.ts
```

To upgrade the executable when it's already installed:
```
deno install --allow-read --allow-write --reload -f -n deno-init https://deno.land/x/init/init.ts
```

## Basic Usage
```
deno-init
```
When run without any options `deno-init` will ask for:
* JavaScript or TypeScript (default TypeScript)
* entrypoint (default `mod.ts`)
* dependency entrypoint (default `deps.ts`) 
* debug configuration file for debugging Deno in Visual Studio Code (default: `y`).

## Available Options
If you simply want to use all the default values you can pass `--yes` or `-y`. Note that `deno-init` will not overwrite anything by default in case you already made some of the files/directories:
```
deno-init -y
```

In case you explicitly want to overwrite existing files you can pass `--force` or `-f`:
```
deno-init -f
```

When you run the command with `--name` or `-n` the script will also create a project directory with the given name and then will add the files into it.
```
deno-init -n myDenoProject
```