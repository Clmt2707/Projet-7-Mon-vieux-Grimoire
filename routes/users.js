const express = require('express');
const router = express.Router();

const emailValidation = require('../middlewares/mail-validator');
const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;