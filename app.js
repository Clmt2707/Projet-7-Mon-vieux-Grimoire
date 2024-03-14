const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const booksRoutes = require('./routes/book');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb+srv://' + process.env.DB_username + ':' + process.env.DB_password + '@' + process.env.DB_cluster + '.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDb réussie !'))
    .catch(() => console.log('Connexion à MongoDb échouée !'));

const limiter = rateLimit({
    windowMS: 60 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes depuis cette adresse IP, rééssayez plus tard.'
});

//Middleware pour la gestion des CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

app.use(express.json());

app.use(limiter);

app.use(helmet({
    crossOriginResourcePolicy: false,
}),
);

app.use('/api/auth', usersRoutes);
app.use('/api/books', booksRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((err, req, res, next) => {
    console.error(err, stack);
    res.status(500).send('UNe erreur est survenue sur le serveur.');
});

module.exports = app;