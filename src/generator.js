import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.join(process.cwd(), ".env") });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("❌ ERROR: No existe la variable GROQ_API_KEY en .env");
  process.exit(1);
}

// Inicializar cliente Groq
const groq = new Groq({ apiKey: GROQ_API_KEY });

/* -----------------------------------------------------------
   IA GENERATOR
----------------------------------------------------------- */

async function generateWithGroq(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Eres una IA experta generadora de código Node.js." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const content = response?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("❌ La IA devolvió contenido vacío");
      return null;
    }

    return content;

  } catch (err) {
    console.error("❌ Error IA:", err.response?.data || err.message);
    return null;
  }
}

/* -----------------------------------------------------------
   CRUD GENERATOR
----------------------------------------------------------- */


async function generateFile(moduleName, fileName, prompt) {
  console.log(`📄 Generando ${fileName}...`);

  let result = await generateWithGroq(prompt);

  if (!result) {
    console.error(`❌ No se generó contenido para: ${fileName}`);
    return;
  }

  // 🔥 Eliminar ```javascript al inicio y ``` al final
  result = result
    .replace(/^```javascript\s*/i, "")  // elimina ```javascript
    .replace(/^```\s*/i, "")            // elimina ``` solo
    .replace(/```$/i, "");              // elimina ``` al final

  const moduleDir = path.join("src", "modules", moduleName);
  if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });

  const filePath = path.join(moduleDir, fileName);

  fs.writeFileSync(filePath, result.trim(), "utf8");

  console.log(`✅ ${fileName} generado en: ${filePath}`);
}

/* -----------------------------------------------------------
   PROMPTS IA
----------------------------------------------------------- */

function getModelPrompt(name) {
  return `
Genera exclusivamente código JavaScript válido para un archivo de modelo Node.js usando clases.
Nombre del modelo: ${name}.
Requisitos:
- No incluyas comentarios en ninguna parte (ni // ni /* */).
- No incluyas explicaciones antes o después del código.
- No uses bloques Markdown como \`\`\`.
- Solo devuelve código JavaScript plano.

Debe contener:
- Clase del modelo con atributos sugeridos.
- Clase contenedora con métodos CRUD simulados: create, findAll, findById, update, delete.
  `;
}

function getControllerPrompt(name) {
  return `
Genera exclusivamente código JavaScript válido para un controlador Express del módulo "${name}".
Requisitos:
- Sin comentarios de ningún tipo.
- Sin explicaciones.
- Sin bloques Markdown.
- Solo código JavaScript plano.

Debe contener:
- Métodos CRUD: getAll, getById, create, update, delete.
- Importar el modelo correspondiente.
  `;
}


function getRoutesPrompt(name) {
  return `
Genera exclusivamente código JavaScript válido para un archivo de rutas Express del módulo "${name}".
Requisitos:
- No generar comentarios.
- No generar explicaciones.
- No usar \`\`\`.
- Solo código JavaScript plano.

Debe contener:
- Router Express.
- Rutas CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id.
- Importar el controlador.
  `;
}


/* -----------------------------------------------------------
   MAIN
----------------------------------------------------------- */

async function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error("❌ Uso correcto: node src/generator.js <nombreModulo>");
    process.exit(1);
  }

  const nameLower = moduleName.toLowerCase();

  console.log(`🚀 Generando CRUD avanzado para módulo: ${nameLower}`);

  // Generar Model
  await generateFile(
    nameLower,
    "model.js",
    getModelPrompt(nameLower)
  );

  // Generar Controller
  await generateFile(
    nameLower,
    "controller.js",
    getControllerPrompt(nameLower)
  );

  // Generar Routes
  await generateFile(
    nameLower,
    "routes.js",
    getRoutesPrompt(nameLower)
  );

  console.log("🎉 CRUD generado exitosamente.\n");
}

main();
