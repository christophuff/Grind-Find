import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getSkaters = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getSingleSkater = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSkaterByUid = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters.json?orderBy="uid"&equalTo="${uid}"`, {
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

// In your StreetSpotForm component or a utility file
const getSkaterId = (uid) =>
  new Promise((resolve, reject) => {
    getSkaterByUid(uid)
      .then((skaterList) => {
        if (skaterList && skaterList.length > 0) {
          // Assuming that skaterList is returned as an array and each skater has a 'firebaseKey' and 'skater_id'
          resolve(skaterList[0].firebaseKey); // Or skaterList[0].skater_id, depending on your structure
        } else {
          reject(new Error('No skater found for the given uid'));
        }
      })
      .catch((error) => reject(error)); // Handle any errors that occur during the fetch
  });

const createSkater = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skaters.json`, {
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
        fetch(`${endpoint}/skaters/${firebaseKey}.json`, {
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
    fetch(`${endpoint}/skaters/${firebaseKey}.json`, {
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
    getSkaterByUid(skater.uid) // Check by Firebase UID
      .then((existing) => {
        console.log('Existing skater found:', existing);

        if (!existing || Object.keys(existing).length === 0) {
          // No skater found, create one
          createSkater(skater)
            .then((newData) => {
              // Ensure newData contains the firebaseKey
              resolve(newData); // Return the new skater data (including firebaseKey)
            })
            .catch(reject); // Reject if creation fails
        } else {
          // Skater already exists
          resolve(existing); // Return existing data (it will contain the firebaseKey)
        }
      })
      .catch(reject); // Reject if there's an error with the `getSkaterByUid` function
  });

export { getSkaters, getSkaterByUid, getSkaterId, getSingleSkater, createSkater, updateSkater, createSkaterIfNotExists };
