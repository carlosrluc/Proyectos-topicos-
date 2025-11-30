const express = require("express");
const router = express.Router();
const controller = require("./alumnos.controller");

router.get("/", controller.getAllAlumnos);

module.exports = router;
