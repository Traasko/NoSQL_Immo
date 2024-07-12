import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListingForm = () => {
  const [formData, setFormData] = useState({
    date_mutation: '',
    valeur_fonciere: '',
    nom_commune: '',
    code_departement: '',
    type_local: '',
    surface_reelle_bati: '',
    nombre_pieces_principales: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/listingDetail', formData)
      .then(response => {
        console.log(response.body);
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error creating the listing!', error);
      });
  };

  return (
    <div>
      <h4>Ajouter</h4>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date_mutation" onChange={handleChange} />
        <input type="number" name="valeur_fonciere" placeholder="Valeur Foncière" onChange={handleChange} />
        <input type="text" name="nom_commune" placeholder="Nom Commune" onChange={handleChange} />
        <input type="number" name="code_departement" placeholder="Code Département" onChange={handleChange} />
        <input type="text" name="type_local" placeholder="Type Local" onChange={handleChange} />
        <input type="number" name="surface_reelle_bati" placeholder="Surface Réelle Bâti" onChange={handleChange} />
        <input type="number" name="nombre_pieces_principales" placeholder="Nombre de Pièces Principales" onChange={handleChange} />
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default ListingForm;
