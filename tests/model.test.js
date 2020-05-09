const build = require("../db/build");
const test = require("tape");

const {createUser, getUsers, getUser, getUserById} = require("../model/users-model");

const {getLinkByID} = require("../model/links-model");

test("DB tests are running!", t => {
    const x = 5;
    t.equal(x, 5, "this is working");
    t.equal(x, 6, "this should fail");
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
                    t.equal(res.length, 3, "Users table is 1 longer");
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

test("Returns a users row by id", t => {
    build().then(() => {
        getUserById("2")
            .then(res => {
                t.equal(res.username, "James");
                t.equal(res.adminusr, false);
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can get a link by the id", t => {
    build().then(() => {
        const id = 1;
        getLinkByID(id)
            .then(res => {
                t.equal(res.title, "bandcamp", "Correct title returned");
                t.equal(res.owner_id, 2, "Correct owner ID returned");
                t.equal(res.link, "www.bandcamp.com", "Correct owner link address returned");
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

// test("Can get update an example by id without all values", t => {
//     build().then(() => {
//         const data = {
//             language: "sql",
//             example: "This is an example of SQL"
//         };
//         updateExamplebyID(4, data, 4)
//             .then(res => {
//                 t.equal(res.language, "sql", "Language updated OK");
//                 t.equal(res.title, "Test example 4", "Title not altered");
//                 t.equal(res.example, "This is an example of SQL", "Example text updated OK");
//                 t.end();
//             })
//             .catch(err => {
//                 t.error(err);
//                 t.end();
//             });
//     });
// });

test("Does not allow duplicate users when email is already in use", t => {
    build().then(() => {
        const user = {
            username: "this-isnt-james",
            email: "james@iscool.com",
            password: "password"
        };
        createUser(user).catch(() => {
            getUsers().then(res => {
                t.equal(res[res.length - 1].username, "James", "Database has not changed");
                t.end();
            });
        });
    });
});
