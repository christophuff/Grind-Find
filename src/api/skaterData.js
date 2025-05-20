import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getSkaterByUid = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters/skaters/${uid}.json`, {
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

export { getSkaterByUid, createSkater, createSkaterIfNotExists };
