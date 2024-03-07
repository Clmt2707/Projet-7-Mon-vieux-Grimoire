const Book = require('../models/book');
const fs = require('fs');
const path = require('path');

//Création d'un book
exports.createBook = (req, res, next) => {
    const bookData = JSON.parse(req.body.book);
    delete bookData._id;
    delete bookData._userId;
    const book = new Book({
        ...bookData,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.convertFilename}`,

        averageRating: bookData.ratings[0].grade
    });
    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre créé avec succès !'});
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//Récupération de tous les books
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}));
};

//Récupération d'un seul livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ message: 'Livre introuvable' }));
};

//Modification d'un livre
exports.modifyBook = (req, res, next) => {
    const bookData = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.convertFilename}`,
    } : { ...req.body };
    
    delete bookData._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : '403: unauthorized request'});
            } else {
                //suppression de l'image
                if (req.file) {
                    const imagePath = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
                    fs.unlink(imagePath, (error) => {
                        if (error) {
                            res.status(400).json( { error });
                        }
                    });
                }

                Book.updateOne({ _id: req.params.id }, { ...bookData, _id: req.params.id})
                    .then(() => {
                        res.status(200).json({ message: 'Livre modifié avec succès !'})
                    })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => {
            res.status(400).json( { error });
        });
};

//Suppression d'un livre 
exports.deleteBook = (req, res, next) => {
    const bookId = req.params.id;

    Book.findOne({ _id: bookId})
        .then(deletedBook => {
           if (deletedBook.userId != req.auth.userId) {
            res.status(401).json({ message:'Unauthorized !'});
           } else {
            const imageName = deletedBook.imageUrl.split('/images/')[1];
            fs.unlink(`images/${imageName}`, () => {
                Book.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Livre supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
           }
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

//Récupération des 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })     //Trie par ordre décroissant de note moyenne
        .limit(3)
        .then(bestRatedBooks => {
            res.status(200).json(bestRatedBooks);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};