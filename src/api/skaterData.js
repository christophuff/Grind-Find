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
      .then((res) => res.json())
      .then((data) => {
        const skaters = Object.entries(data || {});
        if (skaters.length === 0) {
          resolve(null);
        } else {
          const [firebaseKey, skaterData] = skaters[0];
          resolve({ ...skaterData, skater_id: firebaseKey });
        }
      })
      .catch(reject);
  });

// eslint-disable-next-line camelcase
const getSkaterById = (skater_id) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line camelcase
    fetch(`${endpoint}/skaters/${skater_id}.json`)
      .then((res) => res.json())
      .then(resolve)
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

const checkIfUserFollowsSkater = (followerId, followedId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skater_follow/${followerId}_${followedId}.json`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(!!data);
      })
      .catch(reject);
  });

const followSkater = (followerId, followedId) =>
  new Promise((resolve, reject) => {
    const followKey = `${followerId}_${followedId}`;
    const payload = {
      followerId,
      followedId,
      created_at: new Date().toISOString(),
    };

    fetch(`${endpoint}/skater_follow/${followKey}.json`, {
      method: 'PUT', // 'PUT' is used to set a specific key
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          reject(new Error('Error following skater'));
        }
      })
      .catch(() => reject(new Error('Error following skater')));
  });

const unfollowSkater = (followerId, followedId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skater_follow/${followerId}_${followedId}.json`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) resolve(true);
        else reject(new Error('Error unfollowing skater'));
      })
      .catch(() => reject(new Error('Error unfollowing skater')));
  });

const getFollowersOfSkater = (skaterId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skater_follow.json`)
      .then((response) => response.json())
      .then((data) => {
        const followers = Object.values(data || {}).filter((item) => item.followedId === skaterId);
        resolve(followers);
      })
      .catch(reject);
  });

const getSkatersFollowedByUser = (userId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/skater_follow.json`)
      .then((response) => response.json())
      .then((data) => {
        const following = Object.values(data || {}).filter((item) => item.followerId === userId);
        resolve(following);
      })
      .catch(reject);
  });

export { getSkaters, getSkaterByUid, getSkaterById, getSkaterId, getSingleSkater, createSkater, updateSkater, createSkaterIfNotExists, checkIfUserFollowsSkater, followSkater, unfollowSkater, getFollowersOfSkater, getSkatersFollowedByUser };
