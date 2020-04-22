const express = require("express");
const handleError = require("./middleware/error");
const auth = require("./middleware/auth");
const examples = require("./handlers/examples");
const users = require("./handlers/users");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const server = express();
server.use(express.json());


server.get("/all", examples.getAllExamples);
server.post("/examples", auth, examples.post);
server.get("/examples/:id", examples.getExample);
server.delete("/examples/:id", auth, examples.del);
server.put("/examples/:id", auth, examples.updateExample); //NEED TO TEST

server.post("/signup", users.signup);
server.post("/login", users.login);

server.use(express.static('public'))
server.use(handleError);

if (process.env.PGDATABASE !== "localtest") {
  server.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT}`)
  );
}

module.exports = server;
