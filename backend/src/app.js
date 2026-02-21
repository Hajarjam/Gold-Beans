const express = require("express");
const publicRoutes = require("./routes/public.routes");
const coffeeRoutes = require( "./routes/coffee.routes.js");
const machinesRoutes = require( "./routes/machine.routes.js"); 
const usersRoutes = require ("./routes/user.routes.js");
const checkoutRoutes = require("./routes/checkout.routes.js");

const clientRoutes = require("./routes/client.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const dashboardRoutes = require("./routes/admindashboard.routes");

const errorHandler = require("./middlewares/error.middleware");

const app = express();


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
app.use('/api/subscriptions', subscriptionRoutes);
app.use("/api/clients", clientRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/dashboard", dashboardRoutes);


//app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use(errorHandler);

module.exports = app;  
