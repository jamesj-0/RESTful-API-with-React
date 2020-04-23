# Week8-BFOP - Snippets of Code!

[About](#About)

[Stack](#Stack)

[User Stories](#User-Stories)

[Local Installation](#Local-Installation)

[Running the server](#Running-the-server)

[Running the tests](#Running-the-tests)

[Example users and passwords](#Example-users-and-passwords)

[Finally](#Finally)

## About

Snippets of Code is a website for saving, editing finding and sharing useful snippets of code.

Try the project live at https://snippetsofcode.herokuapp.com/

The JSON API that maintains the collection of snippets is based on [the Team CRaKT's Week 7 project](https://github.com/fac19/week7-CRaKT) with a few small fixes and enhancements.

The new SPA / client code is all in the public folder.

Project build as a part of Founders and Coders FAC19.

## Stack

- JavaScript
- Node
- Express
- PostgreSQL
- Hand rolled SPA router in vanilla JS.

## User Stories
- [x] As a user, I want to: see all the resources
- [x] As a user, I want to: sign up for an account
- [x] As a user, I want to: log in to my account
- [x] As a user, I want to: add my own resources
- [x] As a user, I want to: update my own resources
- [x] As a user, I want to: delete my own resources


## Local Installation

1. Clone the repo `git clone https://github.com/fac19/Week8-BFOP.git`
2. CD into that folder `cd Week8-BFOP`
3. Run `npm i` to install dependencies
4. Setup databases
 - Make sure you have a database user with superuser privileges. If you want to use and existing user you can ensure they have superuser privileges like so...
   ```sql
    ALTER USER your_user WITH SUPERUSER;
    ```
 - Create a local production database and assign it to that user.
   ```sql
   CREATE DATABASE local_production_database_name WITH OWNER your_user;
   ```
 - Create a local test database called localtest with the same owner/user
   ```sql
   CREATE DATABASE localtest WITH OWNER your_user;
   ```
5. Create an .env file in the project's root folder
   - PGDATABASE=local_production_database_name
   - PGUSER=your_user
   - PGPASSWORD=your_password
   - SECRET=SECRETCODE
   You can choose a secret of your choice but if you do you won't be able to log in with the exampl accounts we have provided.
   
6. Run `npm run setupdb` to initialize your local production database.

7. If you'd like more and proper full code examples you can import the file /db/examples.sql into your production database with your preffered db admin tool.


## Running the server

Run `npm run dev` to run for development purposes

OR `node server.js` to run server in production mode


## Running the tests

Test can be run with `npm run test`. You must have a database called localtest set up for the tests to run. No mocks here - we need to actually test our models!


## Example users and passwords

There are five default users, their email addresses are.
- admin@iscool.com
- james@iscool.com
- ivo@iscool.com
- cammy@iscool.com
- roger@iscool.com

Their passwords are all, unsurprisingly, 'password'.

The admin account is special. It can delete anyone's posts, other users can only delete their own.

## Finally

Have fun and please PM us if you have an install problems!

P.S. They will almost certainly be database problems, so maybe double-check step 4.

