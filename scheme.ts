// get version, replace canary version hash if any
const denoVersion = Deno.version.deno.replace(/\+[a-z0-9]+$/, "");

const scheme = await import(
  `https://deno.land/x/deno@v${denoVersion}/cli/schemas/config-file.v1.json`,
  { assert: { type: "json" } }
);

// deno-lint-ignore no-explicit-any
const jsonc: any = {};

for (const prop in scheme.default.properties) {
  if (prop !== "compilerOptions") continue;
  jsonc[prop] = {};
  const options = scheme.default.properties[prop].properties;

  for (const option in options) {
    jsonc[prop][option] = [
      options[option].type ?? "type",
      options[option].default,
      options[option].description,
    ].join("|");
  }
}

const jsoncString = JSON.stringify(jsonc, null, 2);
//console.log(jsoncString);
const final = jsoncString.replace(
  /^(\s+".+?": )"(.+?)\|(.+?)\|(.+?)",?$/gm,
  (
    _full_match: string,
    prop: string,
    type: string,
    defaultValue: string,
    desc: string,
  ) => {
    if (type === "array") {
      return prop.replace(' "', ' // "') + '[ "' + defaultValue + '" ]' +
        " // " + desc;
    }

    return prop.replace(' "', ' // "') + defaultValue + " // " + desc;
  },
);

console.log(final);
await Deno.writeTextFile("deno.jsonc", final);
