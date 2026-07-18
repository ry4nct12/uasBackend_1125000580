const express = require('express');
const router = express.Router();
const paketWisataController = require('../controllers/paketwisataControllers');

router.get('/', paketWisataController.getAllPaketWisata);
router.post('/', paketWisataController.addWisataToPaket);
// Route delete membutuhkan dua parameter
router.delete('/:id_paket/:id_wisata', paketWisataController.removeWisataFromPaket);

module.exports = router;