module.exports = (req, res, next) => {
    const connectedUser = req.auth.userId;
    const bookId = req.params.id;

    if( req.body.userId !== connectedUser ) {
        return res.status(403).json({ message: 'Unauthorized access !'});
    }
    next();
};
