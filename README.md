# init

[![deno module](https://shield.deno.dev/x/init)](https://deno.land/x/dci)
![deno compatibility](https://shield.deno.dev/deno/^1.17)
[![Build](https://github.com/GJZwiers/dci/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/dci/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/dci/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/dci?branch=main)
![Deno](https://img.shields.io/static/v1?label=&message=config&color=lightblue&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAB41BMVEUAAAAAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycpKSkqKiorKyssLCwuLi4wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0%2BPj4%2FPz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJkZGRlZWVmZmZnZ2doaGhqampra2tsbGxtbW1wcHBxcXF0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx%2Bfn5%2Ff3%2BAgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4%2BQkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5%2BgoKChoaGioqKjo6OkpKSlpaWmpqaoqKipqamqqqqrq6u6nz8EAAAAAXRSTlMAQObYZgAAAu1JREFUeNqt0wOXJMkewNH%2FHbttjW3btm3btm175pu%2Bt7uVp7I7u9b7O0rdVETEf9OFCe2BTtOvxV9ok0y7%2FgSMAoxeD9eSnT8AqwCM2QMBsPL3BIqmAIMOQXQAUBBcBldgsqazEF2NB7jTWiwBHkCovQtRLKBjP2zLitWAe%2FBN9WuTxvtcIaDshp6sbSlOAtyH9zqG9Ye8rBZQdN2prpl3%2B0kb4KFRy7wgzDnuYb0B3NTlpn3laE7odxH4ZORhnwkTL3g4FG5od9Kuai3MWLp91Bc%2B6n3ZBMKQmzq3t4qbsK0WZuYJvYSA59qchlCyBb4nZGsdiKR6fggf4HgFEIA3CdlSD4YlBCGcbsS6yS3JZ27B5gYgJzbgq9fWTkVV5inl3IaNjcC65CH7fcCo7Qp2m33WJ0RCrnuNHpcAC%2B58j3i6AeAmn6xtMi1P9nLU0VK8hT6R1h485Z3VPQU4ExENTOk%2FbTI%2BMDRatAM68M7Knr6C4RGBTvO778EK9flnJB0C3lv2G%2BmIHLHGVe35EJURzzQ3M8AXi3v6TKRkvRM%2BSVbEhWgeWGJRLz%2F4mJKe9qgXhfoILOptKu9SwlIWRsGAUTXwJiU1FrOtMDkg7VVKlltJrygcAO2ep6SpYTWu%2Fxnp8CRHSmFWzyENPU2IfMfaa026PaBfRKyH6QbainYbLz5%2BdGQ8SvJ6DIDSmxxM7mIKFqAzQKRtBVBxjUiI8YDtQ7EBx1JyFUDNhYTMxCjTwfBpWIwZKfkB2KHnJslx9DQDgHmojzTAbZ2IXB1gCgBzIdLoCFdQEbm%2BwmSAdoZ3y5J5cI70aBmaqgG7tWufJQvhPE2RD2YBlrcjSxZBHZF2Br2xChP6ZUmJBcCDaNZsYDtqBmbJQAvBumhRf7ANZMl486FfZGqE3QXJPHMxOFo1A0vsrGlNdihSeM2egjHjWpNxuBaFK0NboEv%2B4FKUxe%2F2GkBtbn8p%2BBZ%2F2GCZRsSf92ZhB4COiz%2FFf9H%2FAb6oexxnpBFzAAAAAElFTkSuQmCC)

`deno-config-init` (`dci`) is a config file generator for Deno. It is loosely
modeled after `tsc --init` and `npm init`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Contributing](#contributing)

## Requirements

- Deno v1.17 is the bare minimum required to run this module, although Deno v1.24 is recommended in order to use all features.

## Installation

```
deno install --allow-read --allow-write -fn dci https://deno.land/x/dci@v2.6.1/mod.ts
```

## Usage

Make a config file based on a number of prompts:

```
dci
```

Skip the prompts, use all defaults:

```
dci --yes
```

Add every possible option in comments (as a `.jsonc` file):

```
dci --fill
```

## Options

`--help` or `-h` will print the CLI documentation to the terminal.

`--yes` or `-y` will skip the prompts and initialize the file in the current
working directory with default values:

```
dci --yes
```

`--fill` or `-i` will create a `deno.jsonc` config file with all the possible
configuration options listed as comments. This style is very similar to the
output of `tsc --init` for generating a `tsconfig.json`.

```
dci --fill
```

It is also possible to add only specific fields to the config file and fill them
with options in comments, for example:

```
dci --fmt --fill
```

`--fmt` or `-m` will add a `fmt` section only.

```
dci --fmt
```

`--lint` or `-l` will add a `lint` section only.

```
dci --lint
```

`--map` or `-p` will add an `importMap` section only. Note that using
`importMap` requires Deno 1.20 or higher.

```
dci --map
```

`--task` or `-k` will add a `tasks` section only. Note that using `tasks`
requires Deno 1.20 or higher.

```
dci --task
```

`--test` or `-s` will add a `test` section only. Note that using `test` requires
Deno 1.24 or higher.

```
dci --test
```

`--tsconfig` or `-t` will add a `compilerOptions` section only.

```
dci --tsconfig
```

It is possible to combine the `fmt`, `lint`, `map`, `task` and `tsconfig`
options.

`--name` or `-n` will use a non-default name for the config file. The default
name is `deno.json`. Note that using a non-default name may prevent config file
auto-discovery.

```
dci --name config.json
```

`--force` or `-f` will allow overwriting an existing config file.

## Contributing

You are welcome to report bugs, other issues, or make a feature request! If you
want to add a fix/feature/other improvement, please fork this repository and
make a pull request with your changes.
