const express = require('express');
const router = express.Router();
const ulasanController = require('../controllers/ulasanControlers');
const { verifyToken, isAdmin } = require('../controllers/authMiddleware');

// --- ROUTE UMUM (Bisa diakses siapa saja/pelanggan tanpa login) ---
// POST /api/ulasan (Mengirim ulasan baru)
router.post('/', ulasanController.addUlasan);

// GET /api/ulasan/wisata/:id_wisata (Melihat semua review berdasarkan tempat wisata)
router.get('/wisata/:id_wisata', ulasanController.getUlasanByWisata);


// --- ROUTE ADMIN (Hanya boleh diakses Admin yang login) ---
// DELETE /api/ulasan/:id (Admin menghapus komentar spam/bad word)
router.delete('/:id', verifyToken, isAdmin, ulasanController.deleteUlasan);

module.exports = router;