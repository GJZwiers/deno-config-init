# init

[![Build](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/deno-init/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/deno-init?branch=main)
![Deno](https://img.shields.io/static/v1?label=&message=init&color=lightblue&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAB41BMVEUAAAAAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycpKSkqKiorKyssLCwuLi4wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0%2BPj4%2FPz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJkZGRlZWVmZmZnZ2doaGhqampra2tsbGxtbW1wcHBxcXF0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx%2Bfn5%2Ff3%2BAgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4%2BQkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5%2BgoKChoaGioqKjo6OkpKSlpaWmpqaoqKipqamqqqqrq6u6nz8EAAAAAXRSTlMAQObYZgAAAu1JREFUeNqt0wOXJMkewNH%2FHbttjW3btm3btm175pu%2Bt7uVp7I7u9b7O0rdVETEf9OFCe2BTtOvxV9ok0y7%2FgSMAoxeD9eSnT8AqwCM2QMBsPL3BIqmAIMOQXQAUBBcBldgsqazEF2NB7jTWiwBHkCovQtRLKBjP2zLitWAe%2FBN9WuTxvtcIaDshp6sbSlOAtyH9zqG9Ye8rBZQdN2prpl3%2B0kb4KFRy7wgzDnuYb0B3NTlpn3laE7odxH4ZORhnwkTL3g4FG5od9Kuai3MWLp91Bc%2B6n3ZBMKQmzq3t4qbsK0WZuYJvYSA59qchlCyBb4nZGsdiKR6fggf4HgFEIA3CdlSD4YlBCGcbsS6yS3JZ27B5gYgJzbgq9fWTkVV5inl3IaNjcC65CH7fcCo7Qp2m33WJ0RCrnuNHpcAC%2B58j3i6AeAmn6xtMi1P9nLU0VK8hT6R1h485Z3VPQU4ExENTOk%2FbTI%2BMDRatAM68M7Knr6C4RGBTvO778EK9flnJB0C3lv2G%2BmIHLHGVe35EJURzzQ3M8AXi3v6TKRkvRM%2BSVbEhWgeWGJRLz%2F4mJKe9qgXhfoILOptKu9SwlIWRsGAUTXwJiU1FrOtMDkg7VVKlltJrygcAO2ep6SpYTWu%2Fxnp8CRHSmFWzyENPU2IfMfaa026PaBfRKyH6QbainYbLz5%2BdGQ8SvJ6DIDSmxxM7mIKFqAzQKRtBVBxjUiI8YDtQ7EBx1JyFUDNhYTMxCjTwfBpWIwZKfkB2KHnJslx9DQDgHmojzTAbZ2IXB1gCgBzIdLoCFdQEbm%2BwmSAdoZ3y5J5cI70aBmaqgG7tWufJQvhPE2RD2YBlrcjSxZBHZF2Br2xChP6ZUmJBcCDaNZsYDtqBmbJQAvBumhRf7ANZMl486FfZGqE3QXJPHMxOFo1A0vsrGlNdihSeM2egjHjWpNxuBaFK0NboEv%2B4FKUxe%2F2GkBtbn8p%2BBZ%2F2GCZRsSf92ZhB4COiz%2FFf9H%2FAb6oexxnpBFzAAAAAElFTkSuQmCC)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/init)

`deno-init` is a simple command line tool to initialize Deno projects from
prompts.

## Quickstart

```
deno install --allow-read --allow-run=git --allow-write --name deno-init https://deno.land/x/init@v1.4.0/mod.ts

deno-init -y --name awesome_deno_project
```

## Quickerstart (no install)

```
deno run --allow-read --allow-run=git --allow-write https://raw.githubusercontent.com/GJZwiers/deno-init/v1.4.0/mod.ts -y -n awesome_deno_project
```

## Table of Contents

- [Installation](#installation)
- [Permissions](#permissions)
- [Basic Usage](#basic-usage)
- [Options](#options)
- [Contributing](#contributing)

## Installation

First install `deno` and make sure it is available on a terminal. `git` is also
recommended though not required.

Next, run `deno install` to install the CLI:

```
deno install --allow-read --allow-run=git --allow-write --unstable -n deno-init https://deno.land/x/init@v1.4.0/mod.ts
```

You can install `deno-init` from a GitHub raw URL with a tag as well, or without one to get the latest and greatest (though also unreleased) version:

```
deno install --allow-read --allow-run=git --allow-write --unstable -n deno-init https://raw.githubusercontent.com/GJZwiers/deno-init/main/mod.ts
```

To upgrade, run the command with a new version number and include `-f`.

## Permissions

The program needs the following permissions to run:

- `read`: to load files that are used to initialize projects
- `run=git`: is used to allow the program to run `git` commands, of which only
  `git init` is actually called by `deno-init`
- `write`: to make files in order to initialize new projects
- `unstable`: to allow the use of unstable APIs. Right now these come from the
  module's external dependencies.

## Basic Usage

```
deno-init
```

This will prompt you for the following:

- Use TypeScript? (default `y`)
- Set entrypoint: (default `mod.ts`)
- Set dependency entrypoint: (default `deps.ts`)
- Set dev dependency entrypoint: (default `dev_deps.ts`)
- Add import map? (default `n`)

Choosing all defaults will create the following structure in the current
directory:

```
.
├── .gitignore
├── deps.ts
├── dev_deps.ts
├── mod.ts
```

If you choose to init with an import map an `import_map.json` file will be added
to the above. If `git` is installed on the machine then `git init` will be run
as well.

Note that `deno-init` will not overwrite files unless the `--force` option is
used explicitly. This means the program can 'fill in the blanks' in a project
where not all of the files above are present yet.

## Options

`--help` will print helpful information to the terminal.

`--yes` or `-y` will initialize the project in the current working directory
with all the defaults, skipping the prompts:

```
deno-init --yes
```

`--name` or `-n` will initialize the project in a new directory in the current
working directory:

```
deno-init --name my_project
```

```
.
├── my_project
|   ├── .gitignore
|   ├── deps.ts
|   ├── dev_deps.ts
|   ├── mod.ts
```

the `name` argument can be any path in the local filesystem, and `deno-init`
will make any missing directories along the way.

`--map` or `-m` will add an (empty) `import_map.json` file to the project:

```
deno-init --map
```

`--config` or `-c` will add an (empty) `deno.json` file to the project:

```
deno-init --config
```

`--config-only` or `-o` will add _only_ a `deno.json` file to the project. Note
that this also disables running `git init`:

```
deno-init --config-only
```

`--tdd` or `-t` will include a `.test` file to get started with a test-driven
project, such as `mod.test.ts`:

```
deno-init --tdd
```

`--force` or `-f` will allow the program to overwrite existing files. This can
be helpful to re-initialize but use with caution.

```
deno-init --force
```

`--no-git` will disable running `git init` as part of the project
initialization.

```
deno-init --no-git
```

`--ascii` will draw an ASCII Deno to the screen!

```
deno-init --ascii
```

## Contributing

Feel free to submit a bug report, issue or feature request!
