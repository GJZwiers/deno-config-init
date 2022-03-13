// deno-lint-ignore-file no-explicit-any
import json from "https://deno.land/x/deno@v1.19.3/cli/schemas/config-file.v1.json" assert {
  type: "json",
};

const anyJson = json as any;
const jsonc: any = {};

for (const prop in anyJson.properties) {
  jsonc[prop] = {};
  const options = anyJson.properties[prop].properties;
  if (prop == "compilerOptions") {
    for (const option in options) {
      jsonc[prop][option] = [
        options[option].type ?? "type",
        options[option].default,
        options[option].description,
      ].join("|");
    }
  } else {
    for (const option in options) {
      jsonc[prop][option] = {};
      for (const opt in options[option].properties) {
        const o = options[option].properties[opt];

        jsonc[prop][option][opt] = [
          o.type ?? "type",
          o.default ?? "none",
          o.description,
        ].join("|");
      }
    }
  }
}

const jsoncString = JSON.stringify(jsonc, null, 2);

const final = jsoncString.replace(
  /^(\s+".+?": )"(.+?)\|(.+?)\|(.+?)",?$/gm,
  function (
    _full_match,
    prop,
    type,
    defaultValue,
    desc,
  ) {
    if (defaultValue === "none") {
      return prop.replace(' "', ' // "') + "[] // " + desc;
    }
    if (type === "array") {
      return prop.replace(' "', ' // "') + '[ "' + defaultValue + '" ]' +
        " // " + desc;
    }

    return prop.replace(' "', ' // "') + defaultValue + " // " + desc;
  },
);

let highest = 0;
final.split("\n").forEach((line) => {
  const matches = [...line.matchAll(/\/\//g)];

  if (matches.length === 0 || !matches[1].index) return;
  if (matches[1].index > highest) return highest = matches[1].index;
});

const finalFinal = final.split("\n").map((line) => {
  const matches = [...line.matchAll(/(?<!^\s+)\/\//g)];

  if (matches.length === 0 || !matches[0]) return line;

  return line.replace(/(?<!^\s+)\/\//, function (match) {
    const diff = highest - (matches[0].index || 0);

    return " ".repeat(diff) + match;
  });
});

await Deno.writeTextFile("deno.jsonc", finalFinal.join("\n"));