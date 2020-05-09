const build = require("../db/build");
const test = require("tape");

const {createUser, getUsers, getUser, getUserById} = require("../model/users-model");

const {
    getLinkById,
    getAllLinksByUserId,
    getLinksByUsername,
    getUserPrivilage,
    createLink,
    deleteLink,
    updateLinkbyID
} = require("../model/links-model");

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
                    t.equal(res.length, 4, "Users table is 1 longer");
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

test("Returns users admin privaleges by id", t => {
    const userId1 = 1;
    const userId2 = 2;
    build().then(() => {
        getUserPrivilage(userId1).then(res => {
            t.equal(res, true, "User has admin privaleges");
        });
        getUserPrivilage(userId2)
            .then(res => {
                t.equal(res, false, "User has admin privaleges");
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

test("Does not allow duplicate users when email is already in use", t => {
    build().then(() => {
        const user = {
            username: "this-isnt-james",
            email: "james@iscool.com",
            password: "password"
        };
        createUser(user).catch(() => {
            /*using .catch here as I know it will error */
            getUsers().then(res => {
                t.equal(res[res.length - 1].username, "Jimmyface123", "Database has not changed");
                t.end();
            });
        });
    });
});

test("Can get a link by the id", t => {
    build().then(() => {
        const linkId = 1;
        getLinkById(linkId)
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

test("Can get all links by owner_id", t => {
    build().then(() => {
        const id = 2;
        getAllLinksByUserId(2)
            .then(res => {
                t.equal(res[0].title, "bandcamp", "Correct title returned");
                t.equal(res[0].link, "www.bandcamp.com", "Correct link address returned");
                t.equal(res[res.length - 1].title, "soundcloud", "Correct title returned");
                t.equal(
                    res[res.length - 1].link,
                    "www.soundcloud.com",
                    "Correct link address returned"
                );
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can get all links by username", t => {
    build().then(() => {
        const username = "James";
        getLinksByUsername(username)
            .then(res => {
                t.equal(res[0].title, "bandcamp", "Correct first title returned");
                t.equal(res[0].link, "www.bandcamp.com", "Correct first link address returned");
                t.equal(res[res.length - 1].title, "soundcloud", "Correct last title returned");
                t.equal(
                    res[res.length - 1].link,
                    "www.soundcloud.com",
                    "Correct last link address returned"
                );
                t.end();
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can create a link entry", t => {
    build().then(() => {
        const linkEntry = {
            title: "newLink",
            owner_id: 2,
            link: "www.newEntry.com"
        };
        createLink(linkEntry)
            .then(res => {
                getLinkById(res).then(res => {
                    t.equal(res.title, linkEntry.title, "Correct title returned");
                    t.equal(res.owner_id, linkEntry.owner_id, "Correct owner ID returned");
                    t.equal(res.link, linkEntry.link, "Correct owner link address returned");
                    t.end();
                });
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can delete a link entry if user_id matches", t => {
    build().then(() => {
        const linkEntry = {
            title: "newLink",
            owner_id: 2,
            link: "www.newEntry.com"
        };
        createLink(linkEntry)
            .then(res => {
                t.equal(res, 5, "Correct entry ID returned, entry created");
                deleteLink(res, 3).then(res => {
                    t.equal(
                        res,
                        false,
                        "Response from deleteLink is false, owner_id doesn't match"
                    );
                });
                deleteLink(res, linkEntry.owner_id).then(res => {
                    t.equal(res, true, "Response from deleteLink is true, entry was deleted");
                    t.end();
                });
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Admin can delete a link", t => {
    build().then(() => {
        const linkEntry = {
            title: "newLink",
            owner_id: 3,
            link: "www.newEntry.com"
        };
        createLink(linkEntry)
            .then(res => {
                t.equal(res, 5, "Correct entry ID returned, entry created");
                deleteLink(res, 2).then(res => {
                    t.equal(
                        res,
                        false,
                        "Response from deleteLink is false, owner_id does not have admin privaleges"
                    );
                });
                deleteLink(res, 1).then(res => {
                    t.equal(res, true, "Response from deleteLink is true, admin deleted link");
                    t.end();
                });
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Can update a link entry if the owner_id matches", t => {
    build().then(() => {
        const linkEntry = {
            title: "newLink",
            owner_id: 2,
            link: "www.newEntry.com"
        };
        const updateEntry = {
            title: "updateLink",
            owner_id: 2,
            link: "www.updateEntry.com"
        };
        createLink(linkEntry)
            .then(res => {
                getLinkById(res).then(res => {
                    t.equal(res.title, linkEntry.title, "Correct title returned");
                    t.equal(res.owner_id, linkEntry.owner_id, "Correct owner ID returned");
                    t.equal(res.link, linkEntry.link, "Correct owner link address returned");
                    updateLinkbyID(res.id, updateEntry, updateEntry.owner_id).then(res => {
                        t.equal(res.title, updateEntry.title, "Correct title returned");
                        t.equal(res.link, updateEntry.link, "Correct owner link address returned");
                        t.end();
                    });
                });
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});

test("Admin can update a link entry", t => {
    build().then(() => {
        const linkEntry = {
            title: "newLink",
            owner_id: 2,
            link: "www.newEntry.com"
        };
        const updateEntry = {
            title: "updateLink",
            owner_id: 2,
            link: "www.updateEntry.com"
        };
        createLink(linkEntry)
            .then(res => {
                getLinkById(res).then(res => {
                    t.equal(res.title, linkEntry.title, "Entry Created");
                    updateLinkbyID(res.id, updateEntry, 3).then(res => {
                        t.equal(
                            res,
                            false,
                            "owner_id doesn't match, owner_id cannot update this link"
                        );
                    });
                    updateLinkbyID(res.id, updateEntry, 1).then(res => {
                        t.equal(
                            res.title,
                            updateEntry.title,
                            "Correct title returned, Admin updated"
                        );
                        t.equal(
                            res.link,
                            updateEntry.link,
                            "Correct owner link address returned, Admin updated"
                        );
                        t.end();
                    });
                });
            })
            .catch(err => {
                t.error(err);
                t.end();
            });
    });
});
