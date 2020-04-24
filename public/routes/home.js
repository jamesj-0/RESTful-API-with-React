import query from "../query.js";
import writeToNav from "../lib/write-to-nav.js"

const wrapper = document.querySelector("#wrapper");

const allCode = `
<div id="message"></div>
<ul></ul>
`;

function home({redirect}) { 
    writeToNav(redirect);
    writeToWrapper(redirect);
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
    deleteButton.setAttribute('id', 'delete')
    deleteButton.append("Delete");
    deleteButton.dataset.postid = code.id;

    const editButton = document.createElement("button");
    editButton.setAttribute('id', 'edit')
    editButton.dataset.postid = code.id;
    editButton.append('Edit');

    if(userId == code.owner_id){
        li.append(title, name, language, example, deleteButton, editButton);
    } else {
        li.append(title, name, language, example);
    }
    return li;
}

function writeToWrapper(redirect) {
    wrapper.innerHTML = allCode;
    const userId = localStorage.getItem("user-id");

    query("/all")
        .then(json => {
            let codeSnippets = json.map(code => createListItem(code, userId));
            wrapper.querySelector("ul").append(...codeSnippets);
            window.addEventListener('click', handleButtonClick)
            function handleButtonClick(event) {
                if(event.target.tagName === "BUTTON"){
                    const buttonName = event.target.textContent;
                    if(buttonName === "Delete" || buttonName === "Edit"){
                        event.preventDefault();
                        window.history.pushState(null, null, event.target.href); 
                        const postId = Number(event.target.dataset.postid);
                        if(isNaN(postId)) throw new Error ("That's not a post ID chump!");
                        if(buttonName === "Edit"){ redirect(`/post?edit=${postId}`); }
                        if(buttonName === "Delete"){ redirect(`/delete?delete=${postId}`)}
                    }
                }
            }
        })
        .catch(error => {
            console.error(error);
            wrapper.querySelector("#message").append("Something went wrong!");
        });
    }
    

export default home;
