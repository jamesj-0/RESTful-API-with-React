const model = require("../model/users-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const secret = process.env.SECRET;

function signup(req, res, next) {
    if (
        req.body.email === undefined ||
        req.body.username === undefined ||
        req.body.password === undefined
    ) {
        const error = new Error("Missing parameter: email, username, password all required.");
        error.status = 400;
        next(error);
    }
    const newUserEmail = req.body.email;
    const newUserName = req.body.username;
    const rawPassword = req.body.password;

    bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(rawPassword, salt))
        .then(cookedPassword => {
            const newUser = {
                email: newUserEmail,
                username: newUserName,
                password: cookedPassword
            };
            model
                .createUser(newUser)
                .then(userID => {
                    const token = jwt.sign(
                        {
                            user_id: userID,
                            admin: false
                        },
                        secret,
                        {
                            expiresIn: "1h"
                        }
                    );
                    res.status(201).send({
                        username: newUserName,
                        email: newUserEmail,
                        token: token
                    });
                })
                .catch(next);
        })
        .catch(console.error);
}
// login function
// IMPROVEMENTS
// display error message if email or password are missing
function login(req, res, next) {
    model
        .getUser(req.body.email)
        .then(dbUser => {
            return bcrypt.compare(req.body.password, dbUser.user_password).then(result => {
                if (!result) throw new Error("Bad password!");

                const claims = {
                    user_id: dbUser.id,
                    admin: dbUser.adminusr || false
                };
                const token = jwt.sign(claims, secret, {
                    expiresIn: "24h"
                });
                res.send({
                    token: token
                });
            });
        })
        .catch(next);
}

module.exports = {
    signup,
    login
};
