const express = require("express");
const router = express.Router();
const controller = require("./cursos.controller");

router.get("/", controller.getAllCursos);

module.exports = router;
