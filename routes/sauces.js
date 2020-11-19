const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// /!\ A SUPPRIMER AVANT MISE EN PROD DEV ONLY
router.get('/dev', saucesCtrl.getSauces);

router.get('/', auth, saucesCtrl.getSauces);
router.get('/:id', auth, saucesCtrl.getSauceById);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;