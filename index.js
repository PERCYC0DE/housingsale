import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.routes.js";
import propertiesRoutes from "./src/routes/properties.routes.js";
import appRoutes from "./src/routes/app.routes.js";
import apiRoutes from "./src/routes/api.routes.js";
import db from "./config/db.js";

// Create app
const app = express();

// Enable data reading from forms
app.use(express.urlencoded({ extended: true }));

// Enable cookie parser
app.use(cookieParser());

// Enable CSRF
app.use(csurf({ cookie: true }));

// Connect to database
try {
  await db.authenticate();
  db.sync();
  console.log("Connect to database");
} catch (error) {
  console.log(error);
}

// Setting PUG template engine
app.set("view engine", "pug");
app.set("views", "./src/views");

// File Public
app.use(express.static("public"));

// Define routing
app.use("/", appRoutes);
app.use("/auth", userRoutes);
app.use("/", propertiesRoutes);
app.use("/api", apiRoutes);

// Create server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
