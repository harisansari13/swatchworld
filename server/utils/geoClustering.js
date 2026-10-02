/**
 * Haversine Spatial Distance & GPS Clustering Utility
 * Calculates real-world distance between GPS coordinates in meters.
 * Used for Anti-Spam Duplicate Detection within a 10m radius.
 */

function getHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

function findDuplicateComplaint(newLat, newLng, newCategory, existingComplaints, radiusMeters = 15) {
  for (const item of existingComplaints) {
    if (item.status === 'Resolved') continue; // Don't match resolved tickets
    if (item.category === newCategory) {
      const dist = getHaversineDistanceMeters(newLat, newLng, item.location.lat, item.location.lng);
      if (dist <= radiusMeters) {
        return {
          isDuplicate: true,
          originalComplaint: item,
          distanceMeters: Math.round(dist)
        };
      }
    }
  }
  return { isDuplicate: false, originalComplaint: null, distanceMeters: null };
}

module.exports = { getHaversineDistanceMeters, findDuplicateComplaint };
