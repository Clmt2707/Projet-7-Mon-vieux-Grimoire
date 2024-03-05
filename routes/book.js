const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');

const booksCtrl = require('../controllers/book');

router.post('/', auth, multer, booksCtrl.createBook);
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id',auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);



module.exports = router;