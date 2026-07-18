const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingControllers');
const { verifyToken, isAdmin } = require('../controllers/authMiddleware');

// Route Pelanggan
router.get('/', verifyToken, bookingController.getAllBooking);
router.post('/', verifyToken, bookingController.createBooking);
router.get('/riwayat', verifyToken, bookingController.getPelangganBooking);

// Route Admin
router.get('/admin/all', verifyToken, isAdmin, bookingController.getAllBooking);
router.put('/admin/konfirmasi/:id', verifyToken, isAdmin, bookingController.updateStatusBayar);

module.exports = router;