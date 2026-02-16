const express = require("express");
const cors = require("cors");
const path = require("path");

const coffeeRoutes = require("./routes/coffee.routes");
const machinesRoutes = require("./routes/machine.routes");
const publicRoutes = require("./routes/public.routes");
const dashboardRoutes = require("./routes/admindashboard.routes");
const usersRoutes = require("./routes/user.routes")
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE"],
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coffees", coffeeRoutes);
app.use("/api", publicRoutes);
app.use("/api/machines", machinesRoutes);
app.use("/api/users", usersRoutes);


//app.use("/api/admin", adminRoutes);
//app.use("/api/client", clientRoutes);
app.use(errorHandler);



module.exports = app;
