const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Carga dinámica de módulos generados
const modulesPath = path.join(__dirname, "modules");

if (fs.existsSync(modulesPath)) {
  fs.readdirSync(modulesPath).forEach(folder => {
    const routePath = path.join(modulesPath, folder, `${folder}.routes.js`);
    if (fs.existsSync(routePath)) {
      const router = require(routePath);
      app.use(`/api/${folder}`, router);
    }
  });
}

app.get("/", (req, res) => {
  res.send("Generador Acelerado con IA + CI/CD + Cloud");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));


//este codigo permite cargar las rutas generadas automaticamente