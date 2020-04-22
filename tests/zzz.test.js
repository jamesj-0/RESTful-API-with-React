// This file is to close the bd after tests have ran, removes lag

const test = require("tape");
const db = require("../db/connection");

test("Close DB", t => {
    db.end();
    t.end();
})