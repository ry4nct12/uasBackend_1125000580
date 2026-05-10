const express = require('express');
const router = express.Router();
const wisataController = require('../controllers/wisataControllers');

// Mendefinisikan endpoint CRUD
router.get('/', wisataController.getAllWisata);
router.get('/:id', wisataController.getWisataById);
router.post('/', wisataController.createWisata);
router.put('/:id', wisataController.updateWisata);
router.delete('/:id', wisataController.deleteWisata);

module.exports = router;