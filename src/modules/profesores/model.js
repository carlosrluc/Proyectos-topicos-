class Profesor {
  constructor(id, nombre, apellido, edad, materia) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.materia = materia;
  }
}

class ProfesorModel {
  constructor() {
    this.profesores = [];
  }

  create(profesor) {
    this.profesores.push(profesor);
  }

  findAll() {
    return this.profesores;
  }

  findById(id) {
    return this.profesores.find(profesor => profesor.id === id);
  }

  update(id, profesor) {
    const index = this.profesores.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profesores[index] = profesor;
    }
  }

  delete(id) {
    this.profesores = this.profesores.filter(profesor => profesor.id !== id);
  }
}

const profesorModel = new ProfesorModel();
const profesor1 = new Profesor(1, 'Juan', 'Pérez', 35, 'Matemáticas');
const profesor2 = new Profesor(2, 'María', 'Gómez', 30, 'Ciencias');

profesorModel.create(profesor1);
profesorModel.create(profesor2);

console.log(profesorModel.findAll());
console.log(profesorModel.findById(1));
profesorModel.update(1, { nombre: 'Juan Carlos' });
console.log(profesorModel.findAll());
profesorModel.delete(2);
console.log(profesorModel.findAll());