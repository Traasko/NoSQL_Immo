const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importer cors
const listingRoutes = require('./routes/listingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE || 'mongodb+srv://Trasko:Testament95410@cluster0.qlhlmgh.mongodb.net/real_estate';

// Options CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Mettez ici l'URL de votre application React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connecté à : ${DATABASE}`);
}).catch((err) => {
    console.error('Erreur de connexion à MongoDB', err);
});

// Routes des produits
app.use('/listings', listingRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
