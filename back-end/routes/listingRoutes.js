const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController.js');

// Créer une annonce immobilière
router.post('/', listingController.createListing);

// Récupérer toutes les annonces immobilières
router.get('/', listingController.getAllListings);

// Récupérer une annonce immobilière par son ID
router.get('/:id', listingController.getListingById);

// Mettre à jour une annonce immobilière
router.put('/:id', listingController.updateListing);

// Supprimer une annonce immobilière
router.delete('/:id', listingController.deleteListing);

// Récupérer le prix moyen par ville
router.get('/aggregations/averagePriceByCity', listingController.getAveragePriceByCity);

// Récupérer le prix moyen par année
router.get('/aggregations/averagePriceByYear', listingController.getAveragePriceByYear);

// Estimer le prix d'un bien immobilier
router.post('/estimate', listingController.estimatePrice);

// Comparer les prix moyens entre département rural et urbain
router.get('/comparisons/ruralUrban', listingController.comparePricesRuralUrban);

// Comparer les prix moyens par année
// router.get('/comparisons/pricesByYear', listingController.comparePricesByYear);

module.exports = router;