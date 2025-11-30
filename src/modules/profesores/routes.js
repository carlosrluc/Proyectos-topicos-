const express = require("express");
const router = express.Router();
const controller = require("./profesores.controller");

router.get("/", controller.getAllProfesores);

module.exports = router;
