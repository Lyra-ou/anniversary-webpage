const london = { lat: 51.5074, lon: -0.1278 };
const beijing = { lat: 39.9042, lon: 116.4074 };

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistance(km) {
  const miles = km * 0.621371;
  const distanceKm = Math.round(km);
  const distanceMiles = Math.round(miles);
  return `${distanceKm.toLocaleString()} km / ${distanceMiles.toLocaleString()} mi`;
}

const distance = haversineDistance(
  london.lat,
  london.lon,
  beijing.lat,
  beijing.lon
);

const distanceValue = document.getElementById("distanceValue");
distanceValue.textContent = formatDistance(distance);
