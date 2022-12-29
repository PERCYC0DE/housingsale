(function () {
  const lat = -13.4174941;
  const lng = -76.1330409;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 13);

  let markers = new L.FeatureGroup().addTo(mapa);
  let propiedades = [];

  // Filters
  const filtros = {
    categoria: "",
    precio: "",
  };

  const categoriasSelect = document.querySelector("#categorias");
  const preciosSelect = document.querySelector("#precios");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Filtering of Categories and prices
  categoriasSelect.addEventListener("change", (e) => {
    filtros.categoria = +e.target.value; // With +e convert string to number
    filtrarPropiedades();
  });

  preciosSelect.addEventListener("change", (e) => {
    filtros.precio = +e.target.value;
    filtrarPropiedades();
  });

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/properties";
      const response = await fetch(url);
      propiedades = await response.json();
      mostrarPropiedades(propiedades);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarPropiedades = (propiedades) => {
    // Limpiar los markers previos
    markers.clearLayers();

    propiedades.forEach((propiedad) => {
      // Agregar los pines
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.category.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.title}</h1>
                <img src="/uploads/${propiedad?.image}" alt="Imagen de la propiedad ${propiedad.title}">
                <p class="text-gray-600 font-bold">${propiedad.price.name}</p>
                <a href="/properties/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `);
      markers.addLayer(marker);
    });
  };

  const filtrarPropiedades = () => {
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio);
    mostrarPropiedades(resultado);
  };

  const filtrarCategoria = (propiedad) =>
    filtros.categoria ? propiedad.categoryId === filtros.categoria : propiedad;

  const filtrarPrecio = (propiedad) =>
    filtros.precio ? propiedad.priceId === filtros.precio : propiedad;

  obtenerPropiedades();
})();
