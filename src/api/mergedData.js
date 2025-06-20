import { getSingleStreetSpot } from './streetSpotData';
import { getSingleSkater } from './skaterData';

const viewSpotDetails = (spotFirebaseKey) =>
  new Promise((resolve, reject) => {
    getSingleStreetSpot(spotFirebaseKey) // Get the spot details
      .then((spotObject) => {
        getSingleSkater(spotObject.skater_id) // Fetch the skater details using the skater_id
          .then((skaterObject) => {
            resolve({ skaterObject, ...spotObject }); // Combine the spot and skater details
          })
          .catch(reject);
      })
      .catch(reject);
  });

const viewSkaterDetails = (followObjectKey, followObject, role = 'follower') =>
  new Promise((resolve, reject) => {
    const skaterId = role === 'follower' ? followObject.followerId : followObject.followedId;

    getSingleSkater(skaterId)
      .then((skaterData) => {
        resolve({
          ...followObject,
          skaterObject: skaterData,
          skater_id: skaterId,
          firebaseKey: followObjectKey,
        });
      })
      .catch(reject);
  });

export { viewSpotDetails, viewSkaterDetails };
