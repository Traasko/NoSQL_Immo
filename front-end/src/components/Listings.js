import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingDetail from './ListingForm';
import RuralUrbanComparison from './RuralUrbanComparison';

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/listings')
      .then(response => {
        setListings(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the listings!', error);
      });
  }, []);

  return (
    <div>
      <h1>Projet Immo</h1>
      <ListingDetail />
      <ul>
        {listings.map(listing => (
          <li key={listing.id}></li>
          ))}
      </ul>
      <div>
      <section>
        <RuralUrbanComparison />
      </section>
    </div>
      <ul>
        {listings.map(listing => (
          <li key={listing._id}>
            <Link to={`/listings/${listing._id}`}>{listing.nom_commune} - {listing.valeur_fonciere}</Link>
          </li>
        ))}
      </ul>
    </div>  
  );
};

export default Listings;
