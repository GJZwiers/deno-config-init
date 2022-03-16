// deno-lint-ignore-file no-explicit-any
import schema from "https://deno.land/x/deno@v1.19.3/cli/schemas/config-file.v1.json" assert {
  type: "json",
};

// TODO: better types
export function createFromSchema(properties: any, configFile: any) {
  for (const key in properties) {
    if (properties[key].type === "object") {
      configFile[key] = {};
      createFromSchema(properties[key].properties, configFile[key]);
    } else {
      configFile[key] = [
        properties[key].type ?? "type",
        properties[key].default ?? "none",
        properties[key].description,
      ].join("|"); // boolean|true|description
    }
  }
}

export function generateJsonc(): string {
  const configFile: any = {};

  createFromSchema(schema.properties, configFile);

  const jsonString = JSON.stringify(configFile, null, 2);

  const optionMatcher = /^(\s+".+?"): "(.+?)\|(.+?)\|(.+?)",?$/gm;
  // "allowJs": boolean|true|description -> // "allowJs": true /* description */
  const jsoncString = jsonString.replace(
    optionMatcher,
    function (
      _full_match,
      option,
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
      // TODO: maybe integrate with optionMatcher
      const commentedOption = option.replace(/^(\s*?)(?=")/, "$1// ");
      return `${commentedOption}: ${value} /* ${description} */`;
    },
  );

  const lines = jsoncString.split("\n");
  const commentMultiLine = /\/\*/;
  // Find the line with the highest index (right-most) description comment.
  let highest = 0;
  lines.forEach((line) => {
    const start = line.match(commentMultiLine);
    if (!start) return;
    if (!start.index) return;
    if (start.index > highest) return highest = start.index;
  });

  // Align description comments based on the highest index just found.
  const formattedJsoncString = lines.map((line) => {
    const start = line.match(commentMultiLine);
    if (!start) return line;

    return line.replace(commentMultiLine, function (match) {
      const diff = highest - (start.index || 0);
      return " ".repeat(diff) + match;
    });
  }).join("\n");

  return formattedJsoncString;
}
