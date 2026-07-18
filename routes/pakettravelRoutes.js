const express = require('express');
const router = express.Router();
const controller = require('../controllers/pakettravelControllers');

router.get('/', controller.getAllPaketTravel);
router.post('/', controller.createPaketTravel);
router.put('/:id', controller.updatePaketTravel);
router.delete('/:id', controller.deletePaketTravel);

module.exports = router;