const User = require("./../model/userModel");
const calculateHaversineDistance = require("./calculateDistance");

// Custom function to find a match based on origin, destination, and within a certain radius
const findMatch = async (data, maxDistance) => {
  const { origin } = data;

  try {
    const availableRiders = await User.find({ role: "rider" });
    const availableTravelers = await User.find({ role: "student" });

    let closestDistance = Infinity;
    let matchedRider = null;
    let matchedTraveler = null;

    availableRiders.forEach((rider) => {
      const distanceToRider = calculateHaversineDistance(
        origin.latitude,
        origin.longitude,
        rider?.origin?.latitude,
        rider?.origin?.longitude
      );

      availableTravelers.forEach((traveler) => {
        const distanceToTraveler = calculateHaversineDistance(
          origin.latitude,
          origin.longitude,
          traveler?.origin?.latitude,
          traveler?.origin?.longitude
        );

        const totalDistance = distanceToRider + distanceToTraveler;

        if (totalDistance < closestDistance && totalDistance <= maxDistance) {
          closestDistance = totalDistance;
          matchedRider = rider;
          matchedTraveler = traveler;
        }
      });
    });

    if (matchedRider && matchedTraveler) {
      // Found a match, notify both parties
      return { rider: matchedRider, traveler: matchedTraveler };
    } else {
      // No match found
      return null;
    }
  } catch (err) {
    console.error("Error while finding matches:", err);
    return null;
  }
};
module.exports = findMatch;
