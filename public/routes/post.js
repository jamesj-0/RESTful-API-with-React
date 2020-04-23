// import query from "../query.js";
function throwIfNot200(res){
    if (!res.ok){
        console.log("throwIfNot200 is having an error!");
        const error = new Error(res);
        error.status = res.status;
        throw error;
    }
    return res;
}

function decodeJSONOrDie(res){
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("json")) {
      return res.json();
    } else {
        const error = new Error("Was expecting JSON!");
        console.log("Was expecting JSON payload but got", res);
        error.status = res.status;
        throw error;
    }
}



const wrapper = document.querySelector('#wrapper');
const nav = document.querySelector('#navigation');

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

const loggedIn = `
<button class="log-out">Log Out</button>
`;

function postNav(req){

    // check auth token and display accordingly
    const token = localStorage.getItem("access-token");

    if (!token) {
        console.log("No token detected");
        nav.innerHTML = loggedOut;
    } else {
        console.log("Token found");
        nav.innerHTML = loggedIn;
        nav.querySelector(".log-out").addEventListener("click", () => {
            localStorage.removeItem("access-token");
            localStorage.removeItem("user-id");
            req.redirect("/");
        });
    };

}

const postForm = /*html*/`
    <form>
        <label for="title">Title</label><br>
        <input id="title" type="text" name="title">
        <br> <!-- get rid of these is we have time to do some css -->
        <label for="language">Language</label><br>
        <input id="language" type="text" name="language">
        <br>
        <label for="example">Example code</label><br>
        <!--<input id="example" type="text" name="example">-->
        <textarea id="example" type="text" name="example"></textarea>
        <br>
        <div id="message"></div>
        <br>
        <button type="submit">Submit</button>
    </form>
`

function post(req){

    // GET CURRENT FORM FIELDS AND POPULATE
    let edit = req.url.searchParams.get("edit")
    if(edit) edit = Number(edit);
    if(isNaN(edit)) throw new Error ("edit url parameter must be an integer");
    if(edit){
        getCurrentExample(edit)
    }


    wrapper.innerHTML = postForm;
    postNav(req);
    const userId = localStorage.getItem("user-id");
    wrapper.querySelector("#message").innerHTML = "Hi user " + userId + "!";
    const form = document.querySelector("form")
    form.addEventListener("submit", event => submitHandler(event,req));
}

function submitHandler(event,req){
    event.preventDefault();
    const token = localStorage.getItem("access-token");
    let edit = req.url.searchParams.get("edit")
    if(edit) edit = Number(edit);
    if(isNaN(edit)) throw new Error ("edit url parameter must be an integer");
    
    const formData = new FormData(event.target);
    const postBody = Object.fromEntries(formData);
    const method = edit ? "PUT" : "POST";
    const fetchParams = {
        "headers": {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
        "method": method,
        "body": JSON.stringify(postBody)
    }
    
    const endpoint = edit ? `/examples/${edit}` : "/examples";
    fetch(endpoint, fetchParams)
        .then( throwIfNot200 )
        .then( decodeJSONOrDie )
        .then(result => {
            console.log("OUR RESULT IS", result)
            if (!result.exampleId && !result.id) {
                const error = new Error(result);
                error.status = result.status;
                throw error;
            } else {
                console.log("RESULT SEEMS OK:", result);
                req.redirect("/");
            }
        })
        .catch(error => {
            if(error.status && error.status === 401) {
                // Log user out if their auth fails
                window.localStorage.clear()
                wrapper.querySelector("#message").innerHTML =
                `You are not logged in properly. Visit the <a href="/log-in">Log in page</a>`;
            } else {
                console.error("Fetch error:", JSON.stringify(error));
                wrapper.querySelector("#message").append("Something went wrong, soz!");
            }
        });
}

function getCurrentExample(edit) {
    const endpoint = `/examples/${edit}`
    fetch(endpoint)
        .then( throwIfNot200 )
        .then( decodeJSONOrDie )
        .then(result => {
            console.log('result', result)
            wrapper.querySelector("#title").value = result.title;
            wrapper.querySelector("#language").value = result.language;
            wrapper.querySelector("#example").value = result.example;
        })
        .catch((error) => {
            console.error(error);
            wrapper.querySelector("#message").append("Something went wrong, soz!");
        })
}

export default post;
