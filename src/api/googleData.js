const fetchNearbyParks = (lat, lng) =>
  new Promise((resolve, reject) => {
    const url = `http://localhost:3001/api/parks?lat=${lat}&lng=${lng}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const fetchParkDetails = (placeId) =>
  new Promise((resolve, reject) => {
    const url = `http://localhost:3001/api/park-details?place_id=${placeId}`;
    fetch(url)
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

export { fetchNearbyParks, fetchParkDetails };
