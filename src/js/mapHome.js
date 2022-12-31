(function () {
  const lat = -13.4174941;
  const lng = -76.1330409;
  const map = L.map("map-home").setView([lat, lng], 13);

  let markers = new L.FeatureGroup().addTo(map);
  let properties = [];

  // Filters
  const filters = {
    category: "",
    price: "",
  };

  const categoriesSelect = document.querySelector("#categories");
  const pricesSelect = document.querySelector("#prices");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Filtering of Categories and prices
  categoriesSelect.addEventListener("change", (e) => {
    filters.category = +e.target.value; // With +e convert string to number
    filterProperties();
  });

  pricesSelect.addEventListener("change", (e) => {
    filters.price = +e.target.value;
    filterProperties();
  });

  const getProperties = async () => {
    try {
      const url = "/api/properties";
      const response = await fetch(url);
      properties = await response.json();
      showProperties(properties);
    } catch (error) {
      console.log(error);
    }
  };

  const showProperties = (properties) => {
    markers.clearLayers(); // Clear previous markers

    properties.forEach((property) => {
      // Add the pins
      const marker = new L.marker([property?.lat, property?.lng], {
        autoPan: true,
      }).addTo(map).bindPopup(`
                <p class="text-indigo-600 font-bold">${property.category.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${property?.title}</h1>
                <img src="/uploads/${property?.image}" alt="Imagen de la propiedad ${property.title}">
                <p class="text-gray-600 font-bold">${property.price.name}</p>
                <a href="/properties/${property.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `);
      markers.addLayer(marker);
    });
  };

  const filterProperties = () => {
    const result = properties.filter(filterCategory).filter(filterPrice);
    showProperties(result);
  };

  const filterCategory = (property) =>
    filters.category ? property.categoryId === filters.category : property;

  const filterPrice = (property) =>
    filters.price ? property.priceId === filters.price : property;

  getProperties();
})();
