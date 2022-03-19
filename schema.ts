// deno-lint-ignore-file no-explicit-any
import { schema } from "./deps.ts";

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

  const optionMatcher = /^(\s*?)(".+?"): "(.+?)\|(.+?)\|(.+?)",?$/gm;
  // "allowJs": boolean|true|description -> // "allowJs": true /* description */
  const jsoncString = jsonString.replace(
    optionMatcher,
    function (
      _full_match,
      space,
      option,
      type,
      defaultValue,
      description,
    ) {
      let value;
      if (/importMap/.test(option)) {
        value = '"",';
      } else if (type === "boolean" || type === "number") {
        value = defaultValue;
      } else if (type === "array") {
        value = (defaultValue === "none") ? "[]" : `[ "${defaultValue}" ]`;
      } else { // if string or enum
        value = `"${defaultValue}"`;
      }

      return `${space}// ${option}: ${value} /* ${description} */`;
    },
  );

  const lines = jsoncString.split("\n");
  const descriptionComment = /\/\*/;
  // Find the line with the highest index (right-most) description comment.
  let highest = 0;
  const indices: number[] = [];
  lines.forEach((line) => {
    const comment = line.match(descriptionComment);
    if (!comment || !comment.index) return indices.push(-1);
    if (comment.index > highest) highest = comment.index;
    indices.push(comment.index);
  });

  // Align description comments based on the highest index just found.
  const formattedJsoncString = lines.map((line, index) => {
    return line.replace(descriptionComment, (comment) => {
      const diff = highest - (indices[index]);
      return " ".repeat(diff) + comment;
    });
  }).join("\n");

  return formattedJsoncString;
}
