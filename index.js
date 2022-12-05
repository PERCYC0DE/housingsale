import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import db from "./config/db.js";

// Create app
const app = express();
try {
  await db.authenticate();
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
app.use("/auth", userRoutes);

// Create server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
