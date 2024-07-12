import React, { useState } from 'react';
import axios from 'axios';

const RuralUrbanComparison = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchComparison = () => {
    axios.get('http://localhost:5000/listings/comparisons/ruralUrban')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        setError('There was an error fetching the comparison data.');
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={fetchComparison}>Afficher la comparaison des prix ruraux et urbains</button>
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>Comparaison des prix moyens</h2>
          <p><strong>Rural (Département de l'Oise):</strong> {data.rural}</p>
          <p><strong>Urbain (Département du Val d'Oise):</strong> {data.urban}</p>
        </div>
      )}
    </div>
  );
};

export default RuralUrbanComparison;
