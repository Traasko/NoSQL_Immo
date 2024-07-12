const Listing = require('../models/listing');

// Récupérer toutes les annonces immobilières
exports.getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Récupérer une annonce immobilière par son ID
exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (listing == null) {
            return res.status(404).json({ message: "Annonce immobilière introuvable" });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour une annonce immobilière
exports.updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (listing == null) {
            return res.status(404).json({ message: "Annonce immobilière introuvable" });
        }

        // Mettez à jour les champs que vous souhaitez modifier
        if (req.body.date_mutation != null) {
            listing.date_mutation = req.body.date_mutation;
        }
        if (req.body.valeur_fonciere != null) {
            listing.valeur_fonciere = req.body.valeur_fonciere;
        }
        if (req.body.adresse_numero != null) {
            listing.adresse_numero = req.body.adresse_numero;
        }
        if (req.body.adresse_nom_voie != null) {
            listing.adresse_nom_voie = req.body.adresse_nom_voie;
        }
        if (req.body.nom_commune != null) {
            listing.nom_commune = req.body.nom_commune;
        }
        if (req.body.code_departement != null) {
            listing.code_departement = req.body.code_departement;
        }
        if (req.body.type_local != null) {
            listing.type_local = req.body.type_local;
        }
        if (req.body.surface_reelle_bati != null) {
            listing.surface_reelle_bati = req.body.surface_reelle_bati;
        }
        if (req.body.nombre_pieces_principales != null) {
            listing.nombre_pieces_principales = req.body.nombre_pieces_principales;
        }
        console.log(res.json)
        // Sauvegardez les modifications
        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Supprimer une annonce immobilière
exports.deleteListing = async (req, res) => {
    try {
        // Utiliser deleteOne avec un objet de filtre
        const result = await Listing.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Annonce immobilière introuvable" });
        }

        res.json({ message: "Annonce immobilière supprimée" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Récupérer le prix moyen par ville
exports.getAveragePriceByCity = async (req, res) => {
    try {
        const averagePrices = await Listing.aggregate([
            {
                $group: {
                    _id: "$nom_commune",
                    averagePrice: { $avg: "$valeur_fonciere" }
                }
            }
        ]);
        res.json(averagePrices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Récupérer le prix moyen par année
exports.getAveragePriceByYear = async (req, res) => {
    try {
        const averagePrices = await Listing.aggregate([
            {
                $group: {
                    _id: { $year: { $dateFromString: { dateString: "$date_mutation" } } },
                    averagePrice: { $avg: "$valeur_fonciere" }
                }
            }
        ]);
        res.json(averagePrices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Créer une annonce immobilière
exports.createListing = async (req, res) => {
    try {
        const listing = new Listing(req.body);

        // Estimation de la valeur foncière
        const estimatedValue = await estimateValue(listing);
        listing.estimated_value = estimatedValue;

        await listing.save();
        res.status(201).json(listing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Fonction pour estimer la valeur foncière
const estimateValue = async (listing) => {
    const { code_departement, type_local, nombre_pieces_principales } = listing;

    const results = await Listing.aggregate([
        {
            $match: {
                code_departement: code_departement,
                type_local: type_local,
                nombre_pieces_principales: nombre_pieces_principales,
                valeur_fonciere: { $ne: null }
            }
        },
        {
            $group: {
                _id: null,
                averagePrice: { $avg: "$valeur_fonciere" }
            }
        }
    ]);

    return results.length > 0 ? results[0].averagePrice : null;
};

// Méthode pour estimer la valeur foncière via une route dédiée
exports.estimatePrice = async (req, res) => {
    try {
        const { code_departement, type_local, nombre_pieces_principales } = req.body;
        const listing = { code_departement, type_local, nombre_pieces_principales };
        const estimatedValue = await estimateValue(listing);

        res.status(200).json({ estimated_value: estimatedValue });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Comparer les prix moyens entre département rural et urbain
exports.comparePricesRuralUrban = async (req, res) => {
    try {
        const departments = {
            rural: 60,
            urban: 95 
        };

        const [ruralPrices, urbanPrices] = await Promise.all([
            Listing.aggregate([
                { $match: { code_departement: departments.rural, valeur_fonciere: { $ne: null } } },
                { $group: { _id: null, averagePrice: { $avg: "$valeur_fonciere" } } }
            ]),
            Listing.aggregate([
                { $match: { code_departement: departments.urban, valeur_fonciere: { $ne: null } } },
                { $group: { _id: null, averagePrice: { $avg: "$valeur_fonciere" } } }
            ])
        ]);

        const result = {
            rural: ruralPrices.length > 0 ? ruralPrices[0].averagePrice : null,
            urban: urbanPrices.length > 0 ? urbanPrices[0].averagePrice : null
        };

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Comparer les prix moyens entre les années 2019, 2020, et 2021
// exports.comparePricesByYear = async (req, res) => {
//     try {
//         const [avgPrice2019, avgPrice2020] = await Promise.all([
//             Listing2019.aggregate([
//                 { $group: { _id: null, averagePrice: { $avg: "$valeur_fonciere" } } }
//             ]),
//             Listing2020.aggregate([
//                 { $group: { _id: null, averagePrice: { $avg: "$valeur_fonciere" } } }
//             ]),
//             // Listing2021.aggregate([
//             //     { $group: { _id: null, averagePrice: { $avg: "$valeur_fonciere" } } }
//             // ])
//         ]);

//         const result = {
//             '2019': avgPrice2019.length > 0 ? avgPrice2019[0].averagePrice : null,
//             '2020': avgPrice2020.length > 0 ? avgPrice2020[0].averagePrice : null,
//             // '2021': avgPrice2021.length > 0 ? avgPrice2021[0].averagePrice : null
//         };

//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };