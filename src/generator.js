import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function generateCode(prompt) {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content?.trim() || null;

    return content;
  } catch (err) {
    console.error("🔥 Error DeepSeek:", err.response?.data || err.message);
    return null;
  }
}

function replaceTemplate(template, name) {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);

  return template
    .replace(/{{Name}}/g, Name)
    .replace(/{{name}}/g, name.toLowerCase());
}

async function generateModule(moduleName) {
  // RUTA CORRECTA = src/templates
  const templatesPath = path.join(__dirname, "templates");

  const outputDir = path.join(__dirname, "modules", moduleName);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🚀 Generando módulo: ${moduleName}...`);

  const filesToGenerate = [
    { template: "models.txt", output: "model.js" },
    { template: "controller.txt", output: "controller.js" },
    { template: "routes.txt", output: "routes.js" }
  ];

  for (const file of filesToGenerate) {
    const templatePath = path.join(templatesPath, file.template);

    if (!fs.existsSync(templatePath)) {
      console.error(`❌ No existe el template: ${file.template}`);
      continue;
    }

    const templateContent = fs.readFileSync(templatePath, "utf8");
    const replaced = replaceTemplate(templateContent, moduleName);

    if (!replaced || replaced.trim().length < 2) {
      console.error(`❌ Contenido vacío para: ${file.output}`);
      continue;
    }

    const outputPath = path.join(outputDir, file.output);
    fs.writeFileSync(outputPath, replaced);

    console.log(`✔ Archivo generado: ${outputPath}`);
  }

  console.log("🎉 Módulo generado correctamente.");
}

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("❌ Debes indicar el nombre del módulo. Ej:");
  console.error("   node src/generator.js alumnos");
  process.exit(1);
}

generateModule(moduleName);
