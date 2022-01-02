const express = require('express');
const morgan = require('morgan');
require("dotenv").config();

const app = express();
require("./database");

// Server configurations
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


// Routes
app.use("/users", require("./routes/index.routes"));

// 404 Page
app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

// Server conections 
async function init() {
    await app.listen(port);
    console.log("Server on port", port);    
};

init();

/* {
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDIxNGVlMDg0MmYwYTAzNzllMTViZSIsImlhdCI6MTY0MTE1Nzg3MCwiZXhwIjoxNjQxMjQ0MjcwfQ.3pgk-ItHG8xxuyg5q-nXtii4PGrtmNQ4rLi1Gg5Tbrk"
  } */