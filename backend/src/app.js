const express = require("express");
const publicRoutes = require("./routes/public.routes");
const coffeeRoutes = require( "./routes/coffee.routes.js");
const machinesRoutes = require( "./routes/machine.routes.js"); 
const usersRoutes = require ("./routes/user.routes.js")

//const clientRoutes = require("./routes/client.routes");
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");
const app = express();
// in app.js
const cors = require("cors");


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE"],
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/coffees", coffeeRoutes);
app.use("/api", publicRoutes);
app.use("/api/machines", machinesRoutes);
app.use("/api/users", usersRoutes);


//app.use("/api/admin", adminRoutes);
//app.use("/api/client", clientRoutes);
app.use(errorHandler);

module.exports = app;  