export class Colegios {
  constructor(data) {
    Object.assign(this, {
      id: null,
    nombre: null,
    direccion: null,
    telefono: null,
    email: null,
    ciudad: null,
    estado: null,
    municipio: null,
    cp: null,
    logo: null,
    descripcion: null,
    ubicacion: null,
    latitud: null,
    longitud: null,
    created_at: null,
    updated_at: null
    }, data);
  }
}

class ColegiosCollection {
  constructor() {
    this.items = [];
  }

  findAll() {
    return this.items;
  }

  findById(id) {
    return this.items.find(i => i.id === id) || null;
  }

  create(data) {
    const item = new Colegios({ id: Date.now().toString(), ...data });
    this.items.push(item);
    return item;
  }

  update(id, data) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  delete(id) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return null;
    const removed = this.items[index];
    this.items.splice(index, 1);
    return removed;
  }
}

export default new ColegiosCollection();
