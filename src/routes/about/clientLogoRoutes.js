const express = require('express');
const router = express.Router();
const { getClientLogos, createClientLogo, updateClientLogo, deleteClientLogo } = require('../../controllers/about/clientLogoController');

router.get('/', getClientLogos);
router.post('/', createClientLogo);
router.put('/:id', updateClientLogo);
router.delete('/:id', deleteClientLogo);

module.exports = router;