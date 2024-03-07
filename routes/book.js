const express = require('express');
const router = express.Router();

const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const sharp = require('../middlewares/sharp-config');

const booksCtrl = require('../controllers/book');

router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id',auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);



module.exports = router;