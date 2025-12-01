import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("❌ Falta GROQ_API_KEY en .env");
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

/* -----------------------------------------------------------
   IA: SOLO GENERAR ATRIBUTOS DEL MODELO
----------------------------------------------------------- */

async function generateAttributes(modelName) {
  const prompt = `
Devuelve exclusivamente un array JSON con los nombres de atributos
que debería tener un modelo llamado "${modelName}".
Solo devuelve JSON puro. Ejemplo: ["id","nombre","edad"].
Sin explicaciones. Sin markdown. Sin texto adicional.
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "Eres una IA que genera SOLO JSON de atributos." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  let raw = response.choices[0].message.content.trim();

  try {
    return JSON.parse(raw);
  } catch {
    console.error("❌ La IA no devolvió JSON válido:", raw);
    return [];
  }
}

/* -----------------------------------------------------------
   TEMPLATE LOADER
----------------------------------------------------------- */

function loadTemplate(templateName) {
  const filePath = path.join("src", "templates", templateName);
  return fs.readFileSync(filePath, "utf8");
}

function applyTemplate(template, replacements) {
  let output = template;
  for (const key in replacements) {
    const value = replacements[key];
    const regex = new RegExp(`{{${key}}}`, "g");
    output = output.replace(regex, value);
  }
  return output;
}

/* -----------------------------------------------------------
   MAIN GENERATOR
----------------------------------------------------------- */

async function generateModule(moduleName) {
  const nameCap =
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase();

  console.log(`🚀 Generando módulo "${moduleName}"...`);

  // 🎯 Obtener atributos desde Groq
  const attributes = await generateAttributes(moduleName);
  console.log("📌 Atributos generados:", attributes);

  const attributesStr = attributes.map(a => `${a}: null`).join(",\n    ");

  const replacements = {
    ModelName: nameCap,
    CollectionName: nameCap + "Collection",
    attributes: attributesStr
  };

  const moduleDir = path.join("src", "modules", moduleName);
  if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });

  // MODEL
  const modelTemplate = loadTemplate("model.txt");
  const modelContent = applyTemplate(modelTemplate, replacements);
  fs.writeFileSync(path.join(moduleDir, "model.js"), modelContent);

  // CONTROLLER
  const controllerTemplate = loadTemplate("controller.txt");
  const controllerContent = applyTemplate(controllerTemplate, replacements);
  fs.writeFileSync(path.join(moduleDir, "controller.js"), controllerContent);

  // ROUTES
  const routesTemplate = loadTemplate("routes.txt");
  const routesContent = applyTemplate(routesTemplate, replacements);
  fs.writeFileSync(path.join(moduleDir, "routes.js"), routesContent);

  console.log("🎉 CRUD generado exitosamente.");
}

/* -----------------------------------------------------------
   RUN
----------------------------------------------------------- */

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("❌ Uso: node src/generator.js <modulo>");
  process.exit(1);
}

generateModule(moduleName);
