# week7-CRaKT

### INTRO

Project live at https://crakt.herokuapp.com/

REST API returning JSON data with endpoints for creating, reading, updating and deleting stored resources.

API stores "code snippets" examples in the form below:

```javascript
{
username: "user_name", // must be a registered user
owner_id: 1, // user id is automatically generated
language: "JavaScript", // programming language i.e. JavaScript, Java, SQL, Ruby, C etc.
title: "Here's an example", // title goes here
example: "example of a code snippet goes here", // code example goes here
date: "2020-04-16T23:17:56.588Z" // data is automatically generated
}
```

Purpose of this API is to create a a database of useful and easily accessible code examples for students and developers alike.

Project build as a part of Founders and Coders FAC19.

### Stack

-   JavaScript
-   Node
-   Express
-   PostgreSQL

### User Stories

-   As an API user, I want to: get a list of all available resources
-   As an API user, I want to: get all the information on a specific resource
-   As an API user, I want to: create a new resource
-   As an API user, I want to: update an existing resource
-   As an API user, I want to: delete an existing resource
-   As an API user, I want to: only be able to change an existing resource if I am authenticated to do so

### Database Schema

```sql

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(511) NOT NULL,
    adminusr BOOLEAN
);

CREATE TABLE examples
(
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    language VARCHAR(32),
    title VARCHAR(255),
    example TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

```

### Local Installation

1. Clone repo
2. cd into folder
3. Run NPM install
4. If you already have an existing SUPERUSER create a local production psql data base and assign it to that user.
    ```sql
    CREATE DATABASE local_production_database_name WITH OWNER your_user;
    ```

OTHERWISE change your user to a superuser `sql ALTER USER your_user WITH SUPERUSER`

5. Create a test database called localtest with the same owner/user
    ```sql
    CREATE DATABASE localtest WITH OWNER your_user;
    ```
6. Create an .env file in the project's root folder
    - PGDATABASE=local_production_database_name
    - PGUSER=your_user
    - PGPASSWORD=your_password
    - SECRET=JWTSECRET You can choose a secret of your choice.
7. npm run setupdb Alternatively import db/init.sql in your preferred db admin tool

### Running the server

    `npm run dev` to run for development purposes

    OR `node server.js` to run server in production mode

### Running tests

`npm run test`

### Example users and passwords

There are five default users, their email addresses are.

-   admin@iscool.com
-   tom@iscool.com
-   chloe@iscool.com
-   kat@iscool.com
-   roger@iscool.com

Their passwords are, unsurprisingly, 'password'.

The admin account is special. It can delete anyone's posts, other users can only delete their own.

# Using the API

### Get all examples (return json all all stored objects)

`Get /`

Sends back all examples

### Register new user

`POST /signup`

Send a post request to path above using raw json request. Example below:

```json
{
    "username": "Peter Pumpernicke;",
    "email": "peter@iscool.com",
    "password": "password"
}
```

If successful, user object is returned. If user already exists, error will be returned.

### Login as user

`POST /login`

Send a post request to path above using raw json request. Example below:

```json
{
    "email": "registered_email_address",
    "password": "your_password"
}
```

If successful, token object is returned. YOU WILL NEED THIS TOKEN TO ADD OR DELETE EXAMPLES! If email or password are incorrect, error will be returned.

### Get example with a specified ID

`GET /examples/:id`

Send a get request to path above where ":id" is an id of a requested example.

Returns a json object.

### Post a new example

`POST /examples`

YOU MUST LOG IN FIRST AND HAVE AN AUTHORIZATION TOKEN.

Send a post request to path above using raw json request. Example below:

You can use postman or similar tool. Request must be sent with AUTHORIZATION bearer token! You can go to the "Authorization" tab, select "Bearer Token" from the "Type" dropdown, then set the token as "token_generated_during_singup".

```json
{
    "language": "js",
    "title": "enter_title_here",
    "example": "code_cnippet_example_here"
}
```

### Delete example

`DELETE /examples/:id`

YOU MUST LOG IN FIRST AND HAVE AN AUTHORIZATION TOKEN.

Send a DELETE request with the ID of the example you want to delete in the URL. Please make sure header is set to Conent-Type with a value of application/json. Request must be sent with AUTHORIZATION bearer token! You can go to the "Authorization" tab, select "Bearer Token" from the "Type" dropdown, then set the token as "token_generated_during_singup".

If successfull you will receive a json object as below:

```json
{
    "deleted": true
}
```

### Update example

`PUT /examples/:id`

YOU MUST LOG IN FIRST AND HAVE AN AUTHORIZATION TOKEN.

ONLY THE CREATOR OF AN EXAMPLE HAS PERMISSION TO DELETE IT.

Send a PUT request with the ID of the example you want to update in the URL. Please make sure header is set to Content-Type with a value of application/json. Request must be sent with AUTHORIZATION bearer token! You can go to the "Authorization" tab, select "Bearer Token" from the "Type" dropdown, then set the token as "token_generated_during_signup".

Request needs to be sent using raw json format as below:

```json
{
    "language": "value to update",
    "title": "value to update",
    "example": "value to update"
}
```

You only need to include the fields you want to update. Omitted fields will remain unchanged,

### Search by keyword and filter by language example

`GET /search/yourSearchTerm?lang=js`

We sadly didn't get that far but lookout for this feature in the next version!

### Project Acceptance Criteria

-   [x] An Express server that only returns JSON

-   [x] A Postgres database to store the data

-   [x] Endpoints for creating, reading, updating & deleting resources

-   [x] Token-based authentication so only the owner of a resource can change it

-   [x] Correct headers and response metadata (we think)

-   [x] Error-handling to make it easy to use the API to build something

-   [x] Tests for server routes and database access

-   [x] Not process user input as SQL commands

-   [x] Hidden environment variables (i.e. not on GitHub)

### The end

Hope you read it and it made sense! It took me whole bloody morning. If it didn't make sense please let me know what could be made for better readability.

Saludos!
