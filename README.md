# Init

Start Deno projects in Visual Studio Code a little faster with `deno-init`, a small executable that scaffolds a Deno project structure for you.

Select a language (js/ts), entrypoint and optionally a debug configuration.

## Prerequisites
- Deno
- Visual Studio Code
- Deno Language Extension for Visual Studio Code

## Installation
```
deno install --allow-read --allow-write -n deno-init https://deno.land/x/init/init.ts
```

## Usage

When run without any options `deno-init` will ask for:
* JavaScript or TypeScript (default TypeScript)
* entrypoint (default `mod.ts`)
* dependency entrypoint (default `deps.ts`) 
* debug configuration file for debugging Deno in Visual Studio Code (default: `y`).

If you simply want to use all the default values you can pass `--yes` or `-y`. Note that `deno-init` will not overwrite anything by default in case you already made some of the files/directories.

