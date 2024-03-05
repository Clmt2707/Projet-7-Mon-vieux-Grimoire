const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const booksRoutes = require('./routes/book');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb+srv://clmtdbf:hd28KXLXAeS1lFOJ@cluster0.tqjrs2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDb réussie !'))
    .catch(() => console.log('Connexion à MongoDb échouée !'));



//Middleware pour la gestion des CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

app.use(express.json());


app.use('/api/books', booksRoutes);
app.use('/api/auth', usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;