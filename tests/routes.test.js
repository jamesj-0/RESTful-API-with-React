const supertest = require("supertest");
const test = require("tape");
const server = require("../server");
const build = require("../db/build");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

test("Route tests are running!", t => {
    const x = 5;
    t.equal(x, 5, "this is working");
    t.end();
});

test("Test main route returns 200", t => {
    build().then(() => {
        supertest(server)
            .get("/user/James")
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(res.text.includes("James"), true, "James should be present");
                t.equals(res.body.length, 3, "Request body should have 3 links");
                t.equals(res.body[0].title, "bandcamp", "First link title should be bandcamp");
                t.end();
            });
    });
});

test("Test /signup route", t => {
    build().then(() => {
        supertest(server)
            .post("/signup")
            .send({
                username: "Harry",
                email: "harry@potter.com",
                password: "wizard"
            })
            .expect(201)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 201 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.username, "Harry", "Username should be Harry");
                t.notEquals(res.body.token, undefined, "Check that a token exists");
                t.equals(
                    /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/.test(res.body.token),
                    true,
                    "Check for correct jwt token"
                );
                t.end();
            });
    });
});

test("Test /login route", t => {
    build().then(() => {
        supertest(server)
            .post("/login")
            .send({
                email: "james@iscool.com",
                password: "password"
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.notEquals(res.body.token, undefined, "Check that a token exists");
                t.equals(
                    /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/.test(res.body.token),
                    true,
                    "Check for correct jwt token"
                );
                t.end();
            });
    });
});
