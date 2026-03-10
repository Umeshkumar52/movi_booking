import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export const loadTemplate = (templateName, data) => {

  const filePath = path.join(
    process.cwd(),
    "src/templates",
    `${templateName}.hbs`
  );

  const source = fs.readFileSync(filePath, "utf8");

  const template = Handlebars.compile(source);

  return template(data);
};