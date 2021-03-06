const express = require("express");
const path = require("path");
require("dotenv").config();
const handleError = require("./middleware/error");
const auth = require("./middleware/auth");
const {getAllLinks, postLink, removeLink, updateLink} = require("./handlers/links-handlers");
const {signup, login} = require("./handlers/users-handlers");

const PORT = process.env.PORT || 3000;
const server = express();
server.use(express.json());

server.get("/:userName", getAllLinks);

server.post("/signup", signup);
server.post("/login", login);
server.post("/link", auth, postLink);
server.put("/link/update/:id", auth, updateLink);
server.delete("/link/:id", auth, removeLink);

server.use(express.static("public"));
server.use((req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "/public/index.html"));
});
server.use(handleError);

// If this env exists we are in testing mode so don't start the server
if (process.env.PGDATABASE !== "links_test_db") {
    server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

module.exports = server;
