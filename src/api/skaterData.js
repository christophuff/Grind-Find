import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getSkaterByUid = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters/skaters.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => response.text())
      .then((text) => {
        if (!text) {
          resolve(null); // no content, treat as not found
        } else {
          const data = JSON.parse(text);
          if (Array.isArray(data)) resolve(data[0] || null);
          else resolve(data);
        }
      })
      .catch(reject);
  });

const createSkater = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters/skaters.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        const firebaseKey = data.name; // `name` is the auto-generated Firebase key from the POST response

        // Update the skater document with the skater_id set to the Firebase key
        const skaterWithKey = { ...payload, skater_id: firebaseKey }; // Add the Firebase key as `skater_id`

        // Now update the skater document to include the `skater_id`
        fetch(`${endpoint}/skaters/skaters/${firebaseKey}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(skaterWithKey),
        })
          .then(() => resolve(skaterWithKey)) // Resolve with the updated skater data
          .catch(reject); // Reject if update fails
      })
      .catch(reject);
  });

const updateSkater = (firebaseKey, payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters/skaters/${firebaseKey}.json`, {
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

const createSkaterIfNotExists = (skater) =>
  new Promise((resolve, reject) => {
    getSkaterByUid(skater.uid)
      .then((existing) => {
        console.log('Existing skater found:', existing);

        if (!existing || Object.keys(existing).length === 0) {
          // No volunteer found, create one
          createSkater(skater).then(resolve).catch(reject);
        } else {
          // Already exists
          resolve();
        }
      })
      .catch(reject);
  });

export { getSkaterByUid, createSkater, updateSkater, createSkaterIfNotExists };
