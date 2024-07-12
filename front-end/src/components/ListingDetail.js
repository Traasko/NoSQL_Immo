import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState({
    nom_commune: '',
    valeur_fonciere: '',
    date_mutation: '',
    type_local: '',
    surface_reelle_bati: '',
    nombre_pieces_principales: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/listings/${id}`)
      .then(response => {
        setListing(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the listing!', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing(prevListing => ({
      ...prevListing,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/listings/${id}`, listing)
      .then(response => {
        setListing(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('There was an error updating the listing!', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/listings/${id}`)
      .then(response => {
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error deleting the listing!', error);
      });
  };

  if (!listing) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Commune: </label>
            <input
              type="text"
              name="nom_commune"
              value={listing.nom_commune}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Valeur Foncière: </label>
            <input
              type="number"
              name="valeur_fonciere"
              value={listing.valeur_fonciere}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date de Mutation: </label>
            <input
              type="date"
              name="date_mutation"
              value={listing.date_mutation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Type Local: </label>
            <input
              type="text"
              name="type_local"
              value={listing.type_local}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Surface Réelle Bâti: </label>
            <input
              type="number"
              name="surface_reelle_bati"
              value={listing.surface_reelle_bati}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Nombre de Pièces Principales: </label>
            <input
              type="number"
              name="nombre_pieces_principales"
              value={listing.nombre_pieces_principales}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      ) : (
        <div>
          <h1>{listing.nom_commune}</h1>
          <p>Valeur Foncière: {listing.valeur_fonciere}</p>
          <p>Date de Mutation: {listing.date_mutation}</p>
          <p>Type Local: {listing.type_local}</p>
          <p>Surface Réelle Bâti: {listing.surface_reelle_bati}</p>
          <p>Nombre de Pièces Principales: {listing.nombre_pieces_principales}</p>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
          <button onClick={handleDelete}>Supprimer</button>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
