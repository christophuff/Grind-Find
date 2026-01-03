const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const fetchNearbyParks = (lat, lng) =>
  new Promise((resolve, reject) => {
    const url = `${API_URL}/api/parks?lat=${lat}&lng=${lng}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const fetchParkDetails = (placeId) =>
  new Promise((resolve, reject) => {
    const url = `${API_URL}/api/park-details?place_id=${placeId}`;
    fetch(url)
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

export { fetchNearbyParks, fetchParkDetails };
