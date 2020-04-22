const build = require("../db/build");
const test = require("tape");

const {createUser, getUsers, getUser, getUserById} = require("../model/users-model");

const {getExample, updateExamplebyID} = require("../model/examples-model");

test("DB tests are running!", t => {
    const x = 5;
    t.equal(x, 5, "this is working");
    t.end();
});

test("Can create new user", t => {
    build().then(() => {
        const user = {
            username: "Bob123",
            email: "bob@hello.com",
            password: "54321"
        };
        createUser(user).then(() => {
            getUsers()
                .then(res => {
                    t.equal(res[res.length - 1].username, "Bob123", "User has correct name");
                    t.equal(res.length, 6, "Users table is 1 longer");
                    t.end();
                })
                .catch(err => {
                    t.error(err);
                    t.end();
                });
        });
    });
});

test("Returns error if no user found", t => {
    build().then(() => {
        getUser("hello@iscool.com").catch(err => {
            t.equals(err.message, "User does not exist");
            t.end();
        });
    });
});

test("Returns user with a given email address", t => {
    build().then(() => {
        getUser("admin@iscool.com")
            .then(res => {
                t.equal(res.username, "admin", "Correct name returned");
                t.equal(res.adminusr, true, "User has admin permissions");
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can get an example by id", t => {
    build().then(() => {
        getExample(1)
            .then(res => {
                t.equal(res.language, "js", "Correct language returned");
                t.equal(res.title, "Test example 1", "Correct title returned");
                t.equal(res.example, "Example 1 code goes here.", "Correct example text returned");
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can get update an example by id without all values", t => {
    build().then(() => {
        const data = {
            language: "sql",
            example: "This is an example of SQL"
        };
        updateExamplebyID(4, data, 4)
            .then(res => {
                t.equal(res.language, "sql", "Language updated OK");
                t.equal(res.title, "Test example 4", "Title not altered");
                t.equal(res.example, "This is an example of SQL", "Example text updated OK");
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Returns a users row by id", t => {
    build().then(() => {
        getUserById("2")
            .then(res => {
                t.equal(res.username, "Tom");
                t.equal(res.adminusr, false);
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Does not allow duplicate users when email is already in use", t => {
    build().then(() => {
        const user = {
            username: "Tommy",
            email: "tom@iscool.com",
            password: "password"
        };
        createUser(user).catch(() => {
            getUsers().then(res => {
                t.equal(res[res.length - 1].username, "Roger", "Database has not changed");
                // t.equal(res.length, 5);
                t.end();
            });
        });
    });
});
