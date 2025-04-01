import React, { useState } from 'react';
import axios from 'axios';

const RideFareCalculator = () => {
  const [fromAddress, setFromAddress] = useState('11411 E NW hwy suite103, dallas, tx 75218');
  const [toAddress, setToAddress] = useState('');
  const [fare, setFare] = useState(null);
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [loading, setLoading] = useState(false);

  const costPerMile = 0.50;
  const costPerMinute = 0.10;
  const baseFee = 1.00;

  const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your key

  const calculateFare = async () => {
    if (!toAddress) return;

    setLoading(true);
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: fromAddress,
          destinations: toAddress,
          key: API_KEY,
        },
      });

      const data = response.data;
      const element = data.rows[0].elements[0];

      if (element.status === 'OK') {
        const distanceInMiles = element.distance.value / 1609.34;
        const durationInMinutes = element.duration.value / 60;

        const totalFare =
          distanceInMiles * costPerMile +
          durationInMinutes * costPerMinute +
          baseFee;

        setDistanceText(element.distance.text);
        setDurationText(element.duration.text);
        setFare(totalFare.toFixed(2));
      } else {
        alert('Could not calculate distance. Please check the address.');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching distance info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>Ride Fare Calculator</h2>

      <label>
        From:
        <input
          type="text"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>

      <label>
        To:
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Enter destination address"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>

      <button onClick={calculateFare} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate Fare'}
      </button>

      {fare && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Distance:</strong> {distanceText}</p>
          <p><strong>Duration:</strong> {durationText}</p>
          <p><strong>Estimated Fare:</strong> ${fare}</p>
        </div>
      )}
    </div>
  );
};

export default RideFareCalculator;
