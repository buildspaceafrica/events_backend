require("express-async-errors");
const app = require("express")();
const { PORT } = process.env;

// Pre-route middlewares
require("./src/middlewares/pre-route.middleware")(app);

// API routes
app.use("/api", require("./src/routes"));

// Ping route for testing connection
app.get("/ping", (req, res) => res.status(200).send("Who dey breathe"));

// Error middlewares
require("./src/middlewares/error.middleware")(app);

// Listen to server port
app.listen(PORT, async () => {
  console.log(
    `:::> Server listening on port ${PORT} @ http://localhost:${PORT}`
  );
});

// On  server error
app.on("error", (error) => {
  console.error(`<::: An error occurred on the server: \n ${error}`);
});

module.exports = app;
