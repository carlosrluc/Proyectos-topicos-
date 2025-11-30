const express = require('express');
const router = express.Router();
const profesoresController = require('../controllers/profesoresController');

router.get('/', profesoresController.index);
router.get('/:id', profesoresController.show);
router.post('/', profesoresController.store);
router.put('/:id', profesoresController.update);
router.delete('/:id', profesoresController.destroy);

module.exports = router;