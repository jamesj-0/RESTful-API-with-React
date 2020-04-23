import query from "../query.js";

const wrapper = document.querySelector("#wrapper");
const nav = document.querySelector("#navigation");


const loggedIn = `
<button class="log-out">Log Out</button>
`;

const loggedOut = `
<button class="log-in">
    <a href='/log-in'>
    Log In
    </a>
</button>
<button class="sign-up">
    <a href='/sign-up'>
    Sign Up
    </a>
</button>
`;

const allCode = `
<div id="message"></div>
<ul></ul>
`;

function home({redirect}) {
    console.log("home called");
    
    writeToNav(redirect);
    writeToWrapper();
}

function writeToNav(redirect) {
    // check auth token and display accordingly
    const token = localStorage.getItem("token");
    // console.log('token ', !!token, token === 'undefined', typeof token)
    if (token === "undefined" || !token) {
        nav.innerHTML = loggedOut;
    } else {
        nav.innerHTML = loggedIn;
        nav.querySelector("#log-out").addEventListener("click", () => {
            localStorage.removeItem("token");
            redirect("/");
        });
    }
}

function createListItem(code) {
    const li = document.createElement("li");
    const title = document.createElement("h2");
    title.append(code.title);
    const language = document.createElement("h3");
    language.append(code.language);
    const example = document.createElement("p");
    example.append(code.example);
    li.append(title, language, example);
}

function writeToWrapper() {
    wrapper.innerHTML = allCode;
    query("/all")
        .then(json => {
            const codeSnippets = json.map(code => createListItem(code));
            wrapper.querySelector("ul").append(...codeSnippets);
        })
        .catch(error => {
            console.error(error);
            wrapper.querySelector("#message").append("Something went wrong!");
        });
}

export default home;
