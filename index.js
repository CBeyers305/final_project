const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure session middleware for the /customer path
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));



const PORT = 5000;

// Register routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running"));

