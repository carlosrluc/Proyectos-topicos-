const fs = require("fs");
const path = require("path");

function createModule(name) {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);

  const basePath = path.join(__dirname, "modules", name);
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  const templatesPath = path.join(__dirname, "templates");

  const files = ["model", "controller", "routes"];

  files.forEach(file => {
    const template = fs.readFileSync(
      path.join(templatesPath, `${file}.txt`),
      "utf-8"
    );

    const content = template
      .replace(/{{name}}/g, name)
      .replace(/{{Name}}/g, Name);

    fs.writeFileSync(path.join(basePath, `${name}.${file}.js`), content);
  });

  console.log(`✔ Módulo "${name}" generado automáticamente.`);
}

const arg = process.argv[2];
if (!arg) {
  console.log("Uso: node generator.js <nombre-modulo>");
  process.exit();
}

createModule(arg);

//en este caso usaremos un mock (no un API real)