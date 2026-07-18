const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriControllers');
// const { verifyToken, isAdmin } = require('../middleware/auth'); // Aktifkan jika butuh proteksi

router.get('/', kategoriController.getAllKategori);
router.post('/', kategoriController.createKategori);
router.put('/:id', kategoriController.updateKategori);
router.delete('/:id', kategoriController.deleteKategori);

module.exports = router;