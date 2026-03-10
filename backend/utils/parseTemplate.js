import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseTemplate = (templateName, data) => {

  const filePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.hbs`
  );

  const source = fs.readFileSync(filePath, "utf8");

  const template = Handlebars.compile(source);

  return template(data);
};