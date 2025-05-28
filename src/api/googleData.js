const apiKey = 'AIzaSyAnfCI55bELlwCarUVQr3LL1eOhN2GEqiE';

const fetchNearbyParks = (lat, lng) =>
  new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=park&keyword=skatepark&key=${apiKey}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export default fetchNearbyParks;
