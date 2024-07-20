"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const express = require("express");
const path = require("path");
const app = express();

/* ------------------------------------------------------- */
//^ Required Modules:

// envVariables to process.env:
require("dotenv").config({ path: path.join(__dirname, ".env") });
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8061;

// asyncErrors to errorHandler:
require("express-async-errors");

app.use(express.static(path.join(__dirname, "public")));

/* ------------------------------------------------------- */
// Configurations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json());

// Cors:
app.use(require("cors")());

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all("/api/v1/documents", (req, res) => {
  res.send(`
    <h3>Stock Management API Service</h3>
    <hr>
    <p>
        Documents:
        <ul> 
            <li><a href="/api/v1/documents/swagger">SWAGGER</a></li>
            <li><a href="/api/v1/documents/redoc">REDOC</a></li>
            <li><a href="/api/v1/documents/json">JSON</a></li>
        </ul>
    </p>
  `);
});

// API Routes:
app.use("/api/v1", require("./src/routes"));

/* ------------------------------------------------------- */

// Catch-all route for serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "not found" });
});

// Error Handler Middleware
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));

// Sync if in production
// if (process.env.NODE_ENV === "production") {
//   require("./src/configs/sync")();
// }
