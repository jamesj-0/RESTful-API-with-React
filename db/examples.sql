BEGIN;

INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Client fetch with GET', 'function dieIfBadResponse(response) {
    if (!response.ok) throw new Error("Response not OK");
    return response
}

let decodeJSON = res => res.json;

function fetchSomething(searchString, callback, errorHandler){
    console.log("Searching API for ", searchString);
    initOptions = { headers : {''some-token'':''3X5BkCsjR5Rd5TfElUk7Oj''} }
    fetch(`https://example.com/search?$${searchString}`, initOptions)
    .then(dieIfBadResponse)  // the object fetch returns should have a property .ok
    .then(decodeJSON)        // we need to run the .json() method on the raw object
    .then(callback)          // we need to call the callback with the object we received
    .catch(errorHandler);    // we need to do something with any errors objects we get
}');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Fetch helper - query', 'function query(url, options) {
  return fetch(url, options).then((res) => {
    if (!res.ok) {
      const error = new Error("HTTP Error");
      error.status = res.status;
      throw error;
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("json")) {
      return res.json();
    } else {
      return res.text();
    }
  });
}

export default query;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Client fetch with POST', 'fetch("https://fac-dogs.herokuapp.com/v1/users",
    {
        "headers" : { "content-type": "application/json" }, 
        "body": JSON.stringify(yourObjectWotYouWantedPosting),
        "method": "POST" 
    })
    .then( dieIfResponeCodeNot200 )
    .then( decodeJSONOrDieTrying )
    .then( result => {
        console.log("The thing we wanted:", result.whatever );
    })
    .catch( err => console.error(`Bumflaps! there was an error: ${err.message}`)');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Server in vanilla node.js', 'const http = require("http");
const router = require("./router");
const server = http.createServer(router);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening at ${port}`));');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Router function in vanilla Node.js', 'const homeHandler = require("./handlers/home");
const publicHandler = require("./handlers/public");
const missingHandler = require("./handlers/missing");

function router(request, response) {
  const url = request.url;
  if (url === "/") {
    homeHandler(request, response);
  } else if (url.includes("public")) {
    publicHandler(request, response);
  } else {
    missingHandler(request, response);
  }
}

module.exports = router;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Public file server handler', 'const fs = require("fs");
const path = require("path");

const types = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    jpg: "image/jpeg",
    ico: "image/x-icon",
 };

function publicHandler(request, response) {
  let pathBits = request.url.split("/");
  let extension = pathBits[pathBits.length-1].split(".")[1] || "";
  let newPath = path.join(__dirname, "..", ...pathBits);
  fs.readFile(newPath, (error, file) => {
    if (error) {
        response.writeHead(404, { "content-type": "text/html" });
        response.end("<h1>404 : File not found</h1>");
    } else {
      let headers = types[extension] ? { "content-type": types[extension] } : {};
      response.writeHead(200, headers);
      response.end(file);
    }
  });
}

module.exports = publicHandler;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Template cloning and populating', 'function addItem(text, checkBox){    
    let template = document.getElementById(''template'');
    let newItem = template.content.cloneNode(true);
    newItem.querySelector(".item__text") = text;
    let itemCheckBox = newItem.querySelector(".item__checkbox");
    itemCheckBox.checked = checkBox;
    itemCheckBox.addEventListener("click", checkBoxHandler);
    toDoList.appendChild(newItem);
}');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Get ancestor container', 'function getAncestorIfItHasClass(elem, className){
    // Takes a DOM node (typically from event.target) and recursively checks up the
    // DOM tree til it finds a node with className. It then returns that node.
    if(elem.classList.contains(className)) return elem;
    if(elem.parentElement) return getAncestorIfItHasClass(elem.parentElement, className);
}');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Running GET tests with supertest', 'test("Test GET route description", t => {
    supertest(router)
    .get("/the-route-name")
    .expect(200)
    .expect("content-type", "application/json")
    .end( (err, res) => {
        t.error(err);
        t.equal(res.text, JSON.stringify(["some", "json", "data"]));
        t.end();
    });
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Running POST tests with supertest', 'test("Test POST route description" , t => {
    supertest(router)
    .post("/the-route-name")
    .send([''some'', ''post'', ''data'']) // some serializable javascript object
    .set("some-header", "some value") //sends a request header to the server
    .expect(200)
    .expect("content-type", "application/json")
    .end( (err, res) => {
        t.error(err);
        t.equal(res.text, JSON.stringify([''some'', ''post'', ''data'']));
        t.end();
    });
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Receive POST data in vanilla node', 'let data = "";
req.on("data", dat=>data+=dat);
req.on("error", console.error);
req.on("end", _ =>{
    if(data.length){
        // Do something with data
        res.writeHead(200, {"content-type": "application/json" });
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(302, {"location": "/blog" });
        res.end(JSON.stringify({"location": "/blog" }));
    }');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'sql', 'EXAMPLE SQL QUERIES', 'SELECT first_name FROM users;
SELECT first_name FROM users WHERE id = 1;
SELECT first_name FROM users WHERE id = 1 OR id = 2;
SELECT text_content FROM blog_posts WHERE text_content LIKE ''%fudge%'';
SELECT text_content FROM blog_posts WHERE text_content LIKE ''%Ro_ger%'';
SELECT first_name FROM users WHERE id IN (1, 2);
SELECT id, CASE WHEN age > 12 AND age < 20 THEN true ELSE false END AS teenager FROM users;
INSERT INTO users (username, first_name) VALUES (''roger'', ''rog'');
UPDATE users SET first_name = ''rog'' WHERE username = ''roger'';

//INNER JOIN only returns rows where both tables have an entry
SELECT users.username, blog_posts.text_content FROM users INNER JOIN blog_posts ON users.id = blog_posts.user_id;

// LEFT JOIN returns all rows that have a value in the left table, whether they have one in the right one or not
SELECT users.username, blog_posts.text_content FROM users LEFT JOIN blog_posts ON users.id = blog_posts.user_id;

// Privileges - remember to switch to the right db iwht \c <dbname> first!
GRANT ALL PRIVILEGES ON DATABASE learn_node_postgres TO myuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL ON SEQUENCE users_id_seq TO myuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'json', 'package.json scripts', '"scripts": {
    "dev": "nodemon workshop/server.js",
    "test": "PGDATABASE=test_node_postgres tape ''workshop/tests/*'' | tap-spec",
    "watch": "nodemon -q -x ''npm test''"');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', '/database/build', 'const fs = require("fs");
const path = require("path");
const db = require("./connection");
const initPath = path.join(__dirname, "init.sql");
const initSQL = fs.readFileSync(initPath, "utf-8");
const build = () => db.query(initSQL);
module.exports = build;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', '/database/connection.js', 'const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config(); // load environment variables
const db = new pg.Pool(); // create a pool of available connections
module.exports = db; // export the pool for use elsewhere on our server');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'sql', 'example sql table definition / init.sql', 'BEGIN;

DROP TABLE IF EXISTS users, blog_posts CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  age INTEGER,
  location VARCHAR(255)
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  text_content TEXT
);

INSERT INTO users (username, age, location) VALUES
  (''Sery1976'', 28, ''Middlehill, UK''),
  (''Precand'', 19, ''Stanton, UK'')
;

INSERT INTO blog_posts (text_content, user_id) VALUES
  (''Announcing of invitation principles in.'', 1),
  (''Aenean blandit risus sed pellentesque.'', 5)
;

COMMIT;');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Database testing with tape', 'const test = require("tape");
const build = require("../database/build");
const { getUsers, createUser, getPosts } = require("../model");

test("Can get all users", t => {
    build().then(() => {
        getUsers()
        .then(users => {
            const firstUser = users[0];
            t.equal(firstUser.username, "Sery1976", "firstUser.username === ''Sery1976''");
            t.equal(firstUser.age, 28, "firstUser.age === 28");
            t.end();
        })
        .catch( err => {
            t.error(error);
            t.end();
        });
    });
});

test("Can create a new user", t => {
    build()
    .then(() => {
        const data = { username: "roger", age: 44, location: "London" };
        createUser(data)
        .then(getUsers)
        .then(users => {
            const latestUser = users[users.length - 1];
            t.equal(latestUser.username, "roger", "latestUser.username should equal ''roger''");
            t.end();
        })
        .catch(error => {
            t.error(error);
            t.end();
        });
      });
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'zzz.test.js  -  Stop the 10s timeout at the end of db tests', 'const test = require("tape");
const db = require("../database/connection");

test("Dummy test, just want to close db connection!", t => {
        db.end();
        t.end();
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Getting which radio button is selected', 'button.addEventListener("click", () => {
  const checked = document.querySelector("[type=''radio'']:checked")
  const output = document.querySelector("output");
  output.textContent = "You checked: " + checked.id;
})');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Handling uncaught promise rejections in Node', '// in server.js
process.on("unhandledRejection", error => {
  console.error(error);
  process.exit(1);
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Checking requset method in router', '} else if (req.url === "/blog" && req.method === "GET" ) {');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'signUp.js with bcrypt', '// Run npm install bcryptjs to install the library

const bcrypt = require("bcryptjs");

function post(request, response) {
  getBody(request)
    .then(body => {
      const user = new URLSearchParams(body);
      const email = user.get("email");
      const password = user.get("password");
+     bcrypt
+       .genSalt(10)
+       .then(salt => bcrypt.hash(password, salt))
+       .then(hash => model.createUser({ email, password: hash }))
        .then(() => {
          response.writeHead(200, { "content-type": "text/html" });
          response.end(`
            <h1>Thanks for signing up, ${email}</h1>
          `);
        })
        // .');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Log in with bcrypt', 'const bcrypt = require("bcryptjs");

function post(request, response) {
  getBody(request)
    .then(body => {
      const user = new URLSearchParams(body);
      const email = user.get("email");
      const password = user.get("password");
      model
        .getUser(email)
+       .then(dbUser => bcrypt.compare(password, dbUser.password))
+       .then(match => {
+         if (!match) throw new Error("Password mismatch");
          response.writeHead(200, { "content-type": "text/html" });
          response.end(`
            <h1>Welcome back, ${email}</h1>
          `);
        })
        // ...');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Cookies in raw node', 'res.setHeader(''Set-Cookie'', ''logged_in=true; HttpOnly; Max-Age=9000'');
// OR
res.writeHead(200, { ''Set-Cookie'': ''logged_in=true; HttpOnly; Max-Age=9000'' });
// OR multiple
res.writeHead(200, { ''Set-Cookie'': [''logged_in=true;'', ''cat=persian; Secure''] });

// HttpOnly - prevent js from accessing cookie
// Secure - Only set over a HTTPS connection. Prevents MITM
// Max-Age	This sets the cookie lifetime in seconds.

// Reading cookie server side
req.headers.cookie; // ''logged_in=true''

// Delting a cookie
res.setHeader(''Set-Cookie'', ''logged_in=blah; Max-Age=0'');');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Creating a JWT in node', 'const jwt = require(''jsonwebtoken'');
const secret = process.env.SECRET;

claims = {
  one: 123,
  two: "456",
  three: { 7: "89" }
}
const cookie = jwt.sign(claims, secret);
response.writeHead(
  302, {
      ''Location'': ''/'',
      ''Set-Cookie'': `wevs=${cookie}; HttpOnly; Max-Age=20000`
  });
return response.end()');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Creating auth middleware to decode jwt in express for node', 'const cookieParser = require("cookie-parser");
server.use(cookieParser());

function authUser(req, res, next) {
  if(req.cookies.user) {
    try {
        req.user = jwt.verify(req.cookies.user, SECRET);
    }
    catch(err) {
        console.log("Bad token dude!", err);
    }
  }
  next();
}

server.use(authUser);');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'node', 'Detecting if you''re running in production or development', 'if(!process.env.NODE_ENV) {
  console.log("ERROR IN DEVELOPMENT");
  res.status(status).send(`<h1>${error.stack}</h1>`);');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Misc express.js methods', 'const cookieParser = require("cookie-parser");
server.use(express.urlencoded());
server.use(cookieParser());

res.cookie("user", token, { maxAge: 600000 });
res.clearCookie("user");
res.redirect("/profile");
res.status(401).send(`<h1>You need to login dude! <a href="/log-in">Login Page</a></h1>`);

function randomMiddleware(req, res, next) {
  console.log("Farts");
  next();
}
server.use(randomMiddleware);');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'DB model tests', 'test("Check if getListing takes account of search term", t => {
  build().then( () => {
      let searchTerms = { search: "loads" };
      model.getListings(searchTerms).then( listings => {
          t.equal( listings.length, 2, "Exactly two listings returned" );
          t.equal( listings[0].id, 2, "First one has id 2" );
          t.equal( listings[0].title, "Loads of canned peas", "Post concerns peas" );
          t.equal( listings[1].id, 1, "Second has id 1" );
          t.equal( listings[1].username, "joe653", "Was posted by joe653" );
          t.end();
      })  
      .catch( err => {  console.log("SOMETHING''S UP!!!\n", err);   });
  })
});');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'More DB model testing', 'test("Check if delete(1) deletes the correct thing!", t => {
  build().then( () => {
      model.deleteListing(1).then( () => {
          model.getOnlyPostsTable().then ( results => {
              t.equal( results.length, 3, "There should be only 3 results");
              results.forEach( item => { 
                  t.notEqual( item.id, 1, `ID ${item.id} not equal to 1`);
              });
              t.end();
          })
      })
  })
})');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Raw DOM Rendering helper function / module', 'function html(tag, props, ...children){
    const element = document.createElement(tag);
    const elementWithProps = Object.assign(element, props);
    elementWithProps.append(...children);
    return elementWithProps;
}

export default h;

// use

const container = document.getElementById("app");
const header = html("h1", {}, "Here are some dogs...");
const dogElements = dogs.map((dog) =>{
    const name = html("h3", {}, dog.name);
    const pic = html("img", { src: dog.image} );
    const li = html("li", {}, name, pic);
    return li;
});
const list = html("ul", {}, ...dogElements);
container.append(header, list);');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'html', 'HTML data attribute', '<a href="https://example.com" data-wevs="abc">Wevs</a>

function handleClick(event) {
    console.log( event.target.dataset.wevs )
    console.log( "wevs" in event.target.dataset )
}');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'js', 'Getting ALL form fields', 'const formData = new FormData(event.target);
const formObject = Object.fromEntries(formData);');
INSERT INTO examples (owner_id, language, title, example) VALUES (1, 'css', 'Make a links clickable area as big as its parent wit a pseudo class', '.task-five .card {
    position: relative;
}
.task-five .card a:after{
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}');

COMMIT;