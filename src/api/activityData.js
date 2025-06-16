import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const logActivity = (activityObj) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/activities.json`, {
      method: 'POST',
      body: JSON.stringify(activityObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getUserActivities = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/activities.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getActivitiesBySkaterId = (skaterId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/activities.json?orderBy="skater_id"&equalTo="${skaterId}"`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || typeof data !== 'object') return resolve([]);
        const result = Object.entries(data)
          .map(([firebaseKey, value]) => ({
            firebaseKey,
            ...value,
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return resolve(result);
      })
      .catch(reject);
  });

export { logActivity, getUserActivities, getActivitiesBySkaterId };
