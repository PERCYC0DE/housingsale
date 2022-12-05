import express from "express";
import userRoutes from "./src/routes/user.routes.js";

// Create app
const app = express();

// Setting PUG template engine
app.set("view engine", "pug");
app.set("views", "./src/views");

// File Public
app.use(express.static("public"));

// Define routing
app.use("/auth", userRoutes);

// Create server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
