const express = require("express");
const handleError = require("./middleware/error");
const auth = require("./middleware/auth");
const examples = require("./handlers/examples-handlers");
const users = require("./handlers/users-handlers");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const server = express();
server.use(express.json());

server.get("/", examples.getAllExamples);
server.post("/examples", auth, examples.postExample);
server.get("/examples/:id", examples.getExample);
server.delete("/examples/:id", auth, examples.deleteExample);
server.put("/examples/:id", auth, examples.updateExample);
server.post("/signup", users.signup);
server.post("/login", users.login);

server.use(handleError);

// If this env exists we are in testing mode so don't start the server
if (process.env.PGDATABASE !== "localtest") {
    server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

module.exports = server;
