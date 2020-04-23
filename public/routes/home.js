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


function createListItem(code, userId) {
    console.log(code.example, hljs.highlightAuto(code.example)) //TODO: use diff function cos they think its PHP
    const li = document.createElement("li");

    const title = document.createElement("h2");
    title.append(code.title);

    const language = document.createElement("h3");
    language.append(code.language);

    const example = document.createElement("pre");
    const exampleChild = document.createElement("code");
    const codeMarkup = hljs.highlightAuto(code.example).value
    exampleChild.innerHTML = codeMarkup;
    exampleChild.classList.add(code.language);
    example.append(exampleChild);

    if (userId == code.owner_id) {
        const deleteButton = document.createElement("button");
        deleteButton.append("&#128465");
        const editButton = document.createElement("button");
        editButton.append("&#9998");
        return li.append(title, language, example, deleteButton, editButton);
    }

    li.append(title, language, example);
    return li;
}

function writeToWrapper() {
    wrapper.innerHTML = allCode;
    const userId = localStorage.getItem("user_id");

    query("/all")
        .then(json => {
            let codeSnippets = json.map(code => createListItem(code, userId));
            wrapper.querySelector("ul").append(...codeSnippets);
        })
        .catch(error => {
            console.error(error);
            wrapper.querySelector("#message").append("Something went wrong!");
        });
}

export default home;
