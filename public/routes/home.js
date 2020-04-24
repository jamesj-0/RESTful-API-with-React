import query from "../query.js";
import writeToNav from "../lib/write-to-nav.js"

const wrapper = document.querySelector("#wrapper");

const allCode = `
<div id="message"></div>
<ul></ul>
`;

function home({redirect}) { 
    writeToNav(redirect);
    writeToWrapper();
}

function createListItem(code, userId) {
    const li = document.createElement("li");

    const title = document.createElement("h2");
    title.append(code.title);
    const name = document.createElement("h3")
    name.append(code.username);
    const language = document.createElement("h4");
    language.append(code.language);
    const example = document.createElement("pre");
    const exampleChild = document.createElement("code");
    const codeMarkup = hljs.highlightAuto(code.example, [
        code.language.toLowerCase(),
        "javascript",
        "html"
    ]).value;
    exampleChild.innerHTML = codeMarkup;
    example.append(exampleChild);

    const deleteButton = document.createElement("button");
    deleteButton.dataset.postid = code.id;
    deleteButton.append("Delete");

    const editButton = document.createElement("button");
    editButton.dataset.postid = code.id;
    editButton.append('Edit');
    if(userId == code.owner_id){
        li.append(title, name, language, example, deleteButton, editButton);
    } else {
        li.append(title, name, language, example);
    }
    return li;
}

function writeToWrapper() {
    wrapper.innerHTML = allCode;
    const userId = localStorage.getItem("user-id");

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
