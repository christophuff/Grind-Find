import { clientCredentials } from '../utils/client';
import haversine from '../utils/haversine';

const endpoint = clientCredentials.databaseURL;

const getStreetSpots = (lat, lng, radius = 10) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Filter the data based on proximity to the given lat/lng
        const filteredSpots = Object.values(data).filter((spot) => {
          const distance = haversine(lat, lng, spot.latitude, spot.longitude);
          return distance <= radius; // Only include spots within the specified radius
        });
        resolve(filteredSpots); // Return the filtered street spots
      })
      .catch(reject);
  });

const getStreetSpotsByUser = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getSingleStreetSpot = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const createStreetSpot = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const updateStreetSpot = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const deleteStreetSpot = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/street_spots/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getStreetSpots, getStreetSpotsByUser, getSingleStreetSpot, createStreetSpot, updateStreetSpot, deleteStreetSpot };
