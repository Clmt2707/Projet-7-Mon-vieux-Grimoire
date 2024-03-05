const emailValidator = require('email-validator');

const emailChecked = (req, res, next) => {
    const { email } = req.body;

    if (!email || !emailValidator.validate(email)) {
        return res.status(400).json({ error: 'Adresse email incorrecte'});
    }
    next();
}

module.exports = emailChecked;
