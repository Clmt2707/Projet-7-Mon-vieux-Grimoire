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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
        .catch(error => res.status(400).json({ error }));
};

//Modification d'un livre
exports.modifyBook = (req, res, next) => {
    const bookId = req.params.id;

    //Analyse des données du livre si présentes dans le corps de la requête
    const bookData = req.body.book ? JSON.parse(req.body.book) : req.body;
    
    const updateBook = new Book({
        title: bookData.title,
        author: bookData.author,
        year: bookData.year,
        imageUrl: req.file ? req.file.path : bookData.imageUrl,
        genre: bookData.genre,
        ratings: bookData.ratings,
        averageRating: bookData.averageRating
     });

     Book.findOneAndUpdate(
        { _id: bookId },
        updateBook,   // nouvelles infos du livre
        { new: true } //option pour renvoyer le doc maj plutôt que le doc avant maj
     )
        .then(updateBook => {
            if (!updateBook) {
                return res.status(404).json({ message: 'Livre non trouvé !'});
            }
            res.status(200).json({ message: 'Livre mis à jour avec succès !', book: updateBook });
        })
        .catch(error => { 
            res.status(400).json({ error });
        });
};

//Suppression d'un livre 
exports.deleteBook = (req, res, next) => {
    const bookId = req.params.id;

    Book.findOne({ _id: bookId})
        .then(deletedBook => {
            if (deletedBook.userId != req.auth.userId) {
                return res.status(401).json({ message: "Non autorisé!"});
            } else {
                const imagePath = deletedBook.imageUrl.split('/images/')[1];
                fs.unlink(`images/${imagePath}`, () => {
                    Book.deleteOne({ _id: bookId})
                        .then(() => { res.status(200).json({ message: 'Livre supprimé avec succès !'})})
                        .catch(error => res.status(401).json({ error }));
                })
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