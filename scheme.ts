// deno-lint-ignore-file no-explicit-any
import json from "https://deno.land/x/deno@v1.19.3/cli/schemas/config-file.v1.json" assert {
  type: "json",
};

const anyJson = json as any;
const jsonc: any = {};

if ("properties" in anyJson) {
  for (const prop in anyJson.properties) {
    jsonc[prop] = {};
    const options = anyJson.properties[prop].properties;
    for (const option in options) {
      if ("properties" in options[option]) {
        jsonc[prop][option] = {};
        for (const opt in options[option].properties) {
          const o = options[option].properties[opt];
          jsonc[prop][option][opt] = [
            o.type ?? "type",
            o.default ?? "none",
            o.description,
          ].join("|");
        }
      } else {
        jsonc[prop][option] = [
          options[option].type ?? "type",
          options[option].default ?? "none",
          options[option].description,
        ].join("|");
      }
    }
  }
}

const jsoncString = JSON.stringify(jsonc, null, 2);

//console.log(jsonc)

const final = jsoncString.replace(
  /^(\s+".+?": )"(.+?)\|(.+?)\|(.+?)",?$/gm,
  function (
    _full_match,
    property,
    type,
    defaultValue,
    description,
  ) {
    let value;
    if (type === "string") {
      value = `"${defaultValue}"`;
    } else if (type === "array" && defaultValue === "none") {
      value = "[]";
    } else if (type === "array") {
      value = `[ "${defaultValue}" ]`;
    } else {
      value = defaultValue;
    }
    
    // add property as: // "<key>": <value> /* <description> */
    return property.replace(/^(\s*?)(?=")/, '$1// ') + value + " /* " + description + " */";
  },
);

const lines = final.split("\n");
let highest = 0;

lines.forEach((line) => {
  const matches = [...line.matchAll(/\/\*/g)];

  if (matches.length === 0 || !matches[0].index) return;
  if (matches[0].index > highest) return highest = matches[0].index;
});

const configFileContents = lines.map((line) => {
  const matches = [...line.matchAll(/\/\*/g)];

  if (matches.length === 0 || !matches[0]) return line;

  return line.replace(/\/\*/, function (match) {
    const diff = highest - (matches[0].index || 0);

    return " ".repeat(diff) + match;
  });
}).join("\n");

await Deno.writeTextFile("deno.jsonc", configFileContents);
