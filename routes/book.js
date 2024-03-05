const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');

const booksCtrl = require('../controllers/book');

router.post('/', multer, booksCtrl.createBook);
router.put('/:id',multer, booksCtrl.modifyBook);
router.delete('/:id', booksCtrl.deleteBook);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);




module.exports = router;