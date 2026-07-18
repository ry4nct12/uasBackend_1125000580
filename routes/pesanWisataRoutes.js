const express = require('express');
const router = express.Router();
const { getWisataDetail, bookWisata } = require('../controllers/pesanWisataControllers');
const { verifyToken } = require('../controllers/authMiddleware');

router.get('/:id', getWisataDetail); 
router.post('/book', verifyToken, bookWisata);

module.exports = router;