const admin = async (req, res) => {
  res.render("properties/admin", {
    page: "Mis propiedades",
    header: true,
  });
};

// Form to create a new property
const createProperty = async (req, res) => {
  res.render("properties/create", {
    page: "Crear propiedad",
    header: true,
  });
};

export { admin, createProperty };
