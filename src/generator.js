require("dotenv").config();
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateCode(moduleName) {
  const name = moduleName.toLowerCase();
  const Name = name.charAt(0).toUpperCase() + name.slice(1);

  const basePath = path.join(__dirname, "modules", name);
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

  // Prompt para generar el MODEL
  const modelPrompt = `
Genera un archivo de modelo en Node.js para un módulo llamado "${name}".
Incluye:
- una clase "${Name}Model"
- atributos típicos según el nombre
- constructor
- métodos CRUD básicos (create, findAll, findById, update, delete)
- usa sintaxis moderna de JavaScript
`;

  // Prompt para el CONTROLLER
  const controllerPrompt = `
Genera un archivo controller para el módulo "${name}".
Incluye funciones:
- getAll${Name}
- get${Name}ById
- create${Name}
- update${Name}
- delete${Name}

Cada función debe responder con JSON.
No usar bases de datos reales. Usa un arreglo en memoria como mock.
`;

  // Prompt para las ROUTES
  const routesPrompt = `
Genera un archivo de rutas Express para el módulo "${name}".
Incluye:
- GET /
- GET /:id
- POST /
- PUT /:id
- DELETE /:id

Debe importar el controller y crear un router de Express.
Exporta el router.
`;

  console.log("Generando código con IA...");

  // MODEL
  const modelResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: modelPrompt }]
  });

  fs.writeFileSync(
    path.join(basePath, `${name}.model.js`),
    modelResponse.choices[0].message.content
  );

  // CONTROLLER
  const controllerResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: controllerPrompt }]
  });

  fs.writeFileSync(
    path.join(basePath, `${name}.controller.js`),
    controllerResponse.choices[0].message.content
  );

  // ROUTES
  const routesResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: routesPrompt }]
  });

  fs.writeFileSync(
    path.join(basePath, `${name}.routes.js`),
    routesResponse.choices[0].message.content
  );

  console.log(`✔ Módulo "${name}" generado por IA.`);
}

const arg = process.argv[2];

if (!arg) {
  console.log("Uso: node src/generator.js <nombre-modulo>");
  process.exit();
}

generateCode(arg);
