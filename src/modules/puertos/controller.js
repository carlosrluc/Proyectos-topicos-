import Model from "./model.js";

class Controller {
  getAll(req, res) {
    res.json(Model.findAll());
  }

  getById(req, res) {
    const item = Model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  }

  create(req, res) {
    const created = Model.create(req.body);
    res.status(201).json(created);
  }

  update(req, res) {
    const updated = Model.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  }

  delete(req, res) {
    const deleted = Model.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  }
}

export default new Controller();
