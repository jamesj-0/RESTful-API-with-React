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
            .get("/James")
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(res.text.includes("James"), true, "James should be present");
                t.equals(res.body.length, 3, "Request body should have 3 links");
                t.equals(
                    res.body[0].title,
                    "Recent Releases",
                    "First link title should be bandcamp"
                );
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

test("Test /links POST route with valid auth token", t => {
    build().then(() => {
        const token = jwt.sign(
            {
                user_id: 2,
                admin: false
            },
            process.env.SECRET,
            {
                expiresIn: "1hr"
            }
        );
        supertest(server)
            .post("/link")
            .set({
                Authorization: "Bearer " + token
            })
            .send({
                title: "Test Post 99",
                link: "Test body 99"
            })
            .expect(201)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(typeof res.body.linkId, typeof 1, "Check we get an integer ID");
                t.end();
            });
    });
});

test("Test /link POST route fails without valid auth token", t => {
    build().then(() => {
        const token = jwt.sign(
            {
                user_id: 2,
                admin: false
            },
            process.env.SECRET,
            {
                expiresIn: "1hr"
            }
        );
        supertest(server)
            .post("/link")
            .set({
                Authorization: "Bearer lsdkdfjlskdfjlskdjfwoierwoierfksd"
            })
            .send({
                title: "Test Post 99",
                link: "Test body 99"
            })
            .expect(401)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 401 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.error.status, 401, "Should get error object with status 401");
                t.end();
            });
    });
});

test("Test /link/3 DELETE route with correct owner", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 2}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .delete("/link/3")
            .set({
                Authorization: "Bearer " + token
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.deleted, true, "Item deleted");
                t.end();
            });
    });
});

test("Test /link/3 DELETE route with wrong owner", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 3}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .delete("/link/1")
            .set({
                Authorization: "Bearer " + token
            })
            .expect(403)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 403 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.error.status, 403, "Should get error object with status 401");

                t.end();
            });
    });
});

test("Test /link/1 DELETE route with admin user who is not owner", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 1}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .delete("/link/4")
            .set({
                Authorization: "Bearer " + token
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.deleted, true, "Item deleted");
                t.end();
            });
    });
});

test("Test /link/1 DELETE route fails with unauthenticated user", t => {
    build().then(() => {
        supertest(server)
            .delete("/link/1")
            .set({
                Authorization: "Bearer " + "dffgasdfhljsdfhdsflsdfj"
            })
            .expect(401)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.error.status, 401, "Should get error object with status 401");
                t.end();
            });
    });
});

test("Test /link/update/ PUT route updates with authenticated user", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 2}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .put("/link/update/3")
            .set({
                Authorization: "Bearer " + token
            })
            .send({
                title: "Test Post",
                link: "Test.com"
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(
                    res.body.title,
                    "Test Post",
                    "Check to see if the correct title is returned"
                );
                t.end();
            });
    });
});

test("Test /link/update/ PUT route updates with just title & authenticated user", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 2}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .put("/link/update/3")
            .set({
                Authorization: "Bearer " + token
            })
            .send({
                title: "Test Post"
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(
                    res.body.title,
                    "Test Post",
                    "Check to see if the correct title is returned"
                );
                t.equals(
                    res.body.link,
                    "www.soundcloud.com",
                    "Check to see if the original link is returned"
                );
                t.end();
            });
    });
});

test("Test /link/update/ PUT route updates with unauthenticated user", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 3}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .put("/link/update/3")
            .set({
                Authorization: "Bearer " + token
            })
            .send({
                title: "Test Post",
                link: "Test.com"
            })
            .expect(401)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 401 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(res.body.error.status, 401, "Should get error object with status 401");
                t.end();
            });
    });
});

test("Test /link/update/ PUT route updates with admin user", t => {
    build().then(() => {
        const token = jwt.sign({user_id: 1}, process.env.SECRET, {
            expiresIn: "1hr"
        });
        supertest(server)
            .put("/link/update/3")
            .set({
                Authorization: "Bearer " + token
            })
            .send({
                title: "Test Post",
                link: "Test.com"
            })
            .expect(200)
            .expect("content-type", "application/json; charset=utf-8")
            .end((err, res) => {
                t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
                t.equals(typeof res.body, typeof {}, "Check an Object is returned");
                t.equals(
                    res.body.title,
                    "Test Post",
                    "Check to see if the correct title is returned"
                );
                t.end();
            });
    });
});
