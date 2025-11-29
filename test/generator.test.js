const fs = require("fs");

test("El módulo alumnos existe", () => {
  expect(fs.existsSync("src/modules/alumnos")).toBe(true);
});
