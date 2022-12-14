(function () {
  const lat = document.querySelector("#lat").value || -13.4164325;
  const lng = document.querySelector("#lng").value || -76.1397925;
  const map = L.map("map").setView([lat, lng], 16);
  let marker;

  // Use provider and geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(map);

  // Detect movement of the pin and read its coordinate
  marker.on("moveend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    map.panTo(new L.LatLng(position.lat, position.lng));

    // Get info of street to draggable pin
    geocodeService
      .reverse()
      .latlng(position, 13)
      .run(function (error, result) {
        marker.bindPopup(result.address.LongLabel).openPopup();

        document.querySelector(".street").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#street").value =
          result?.address?.Address ?? "";
        document.querySelector("#lat").value = result?.latlng?.lat ?? "";
        document.querySelector("#lng").value = result?.latlng?.lng ?? "";
      });
  });
})();
