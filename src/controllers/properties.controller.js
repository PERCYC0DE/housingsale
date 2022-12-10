const admin = async (req, res) => {
  res.render("properties/admin", {
    page: "Mis propiedades",
    header: true,
  });
};

export { admin };
