import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Listings from './components/Listings';
import ListingForm from './components/ListingForm';
import ListingDetail from './components/ListingDetail';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listings/new" element={<ListingForm />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
