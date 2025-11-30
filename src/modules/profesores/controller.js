const express = require('express');
const router = express.Router();
const Profesor = require('../models/Profesor');

router.get('/', async (req, res) => {
    try {
        const profesores = await Profesor.find();
        res.json(profesores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener profesores' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const profesor = await Profesor.findById(id);
        if (!profesor) {
            res.status(404).json({ message: 'Profesor no encontrado' });
        } else {
            res.json(profesor);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener profesor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const profesor = new Profesor(req.body);
        await profesor.save();
        res.json(profesor);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear profesor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const profesor = await Profesor.findByIdAndUpdate(id, req.body, { new: true });
        if (!profesor) {
            res.status(404).json({ message: 'Profesor no encontrado' });
        } else {
            res.json(profesor);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar profesor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Profesor.findByIdAndDelete(id);
        res.json({ message: 'Profesor eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar profesor' });
    }
});

module.exports = router;