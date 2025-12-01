import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Carpeta de módulos generados
const modulesPath = path.join(__dirname, "modules");

if (fs.existsSync(modulesPath)) {
  fs.readdirSync(modulesPath).forEach(folder => {
    const routeFile = path.join(modulesPath, folder, "routes.js");

    if (fs.existsSync(routeFile)) {
      // Convertir la ruta Windows → file:// URL válida
      const routeURL = pathToFileURL(routeFile).href;

      import(routeURL).then(module => {
        const router = module.default;
        app.use(`/api/${folder}`, router);
      });
    }
  });
}

app.get("/", (req, res) => {
  res.send("Generador Acelerado con IA + CI/CD + Cloud - ESM Ready");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
