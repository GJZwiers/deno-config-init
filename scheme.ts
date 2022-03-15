// deno-lint-ignore-file no-explicit-any
import json from "https://deno.land/x/deno@v1.19.3/cli/schemas/config-file.v1.json" assert {
  type: "json",
};

const anyJson = json as any;
const denoJson: any = {};

function createFromSchema(obj: any, denoJson: any) {
  for (const prop in obj) {
    if (obj[prop].type === "object") {
      denoJson[prop] = {};
      createFromSchema(obj[prop].properties, denoJson[prop]);
    } else {
      denoJson[prop] = [
        obj[prop].type ?? "type",
        obj[prop].default ?? "none",
        obj[prop].description,
      ].join("|");
    }
  }
}

createFromSchema(anyJson.properties, denoJson);

const jsoncString = JSON.stringify(denoJson, null, 2);

const unformattedContents = jsoncString.replace(
  /^(\s+".+?"): "(.+?)\|(.+?)\|(.+?)",?$/gm,
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

    const commentedOption = property.replace(/^(\s*?)(?=")/, "$1// ");
    return `${commentedOption}: ${value} /* ${description} */`;
  },
);

const lines = unformattedContents.split("\n");
// find the line with the highest index (right-most) description comment
let highest = 0;
lines.forEach((line) => {
  const start = line.match(/\/\*/);
  if (!start) return;
  if (!start.index) return;
  if (start.index > highest) return highest = start.index;
});

const configFileContents = lines.map((line) => {
  const start = line.match(/\/\*/);
  if (!start) return line;

  return line.replace(/\/\*/, function (match) {
    const diff = highest - (start.index || 0);

    return " ".repeat(diff) + match;
  });
}).join("\n");

await Deno.writeTextFile("deno.jsonc", configFileContents);
