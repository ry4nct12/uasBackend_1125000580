const express = require('express');
const router = express.Router();
const paketController = require('../controllers/paketControllers');
const { verifyToken, isAdmin } = require('../controllers/authMiddleware');

// --- ROUTE UMUM (Bisa diakses Pelanggan tanpa/dengan login) ---
router.get('/', paketController.getAllPaket); // List semua paket di homepage
router.get('/:id', paketController.getDetailPaket); // Detail paket + list wisatanya

// --- ROUTE ADMIN (Wajib Login & Harus Admin) ---
router.post('/', verifyToken, isAdmin, paketController.createPaket); // Buat paket baru
router.put('/status/:id', verifyToken, isAdmin, paketController.updateStatusPaket); // Ganti status paket

module.exports = router;