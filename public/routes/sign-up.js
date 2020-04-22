import query from "../query.js";

const app = document.getElementById("app");

const signUpPage = /*html*/`
    <form>
        <label for="username">Username</label>
        <input id="username" type="text" name="username">
        <label for="email">Email</label>
        <input id="email" type="email" name="email">
        <label for="password">Password</label>
        <input id="password" type="password" name="password">
        <div id="message"></div>
        <button type="submit">Submit</button>
    </form>
`

function signUp(req){
    app.innerHTML = signUpPage;
    const form = document.querySelector("form");
    form.addEventListener("submit", event => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData);
        query("/sign-up", {
            "headers" : { "content-type": "application/json" }, 
            "body": JSON.stringify(formObject),
            "method": "POST" 
        })
        .then( result => {
            console.log("OUR RESULT & token:", result, result.access_token);
            if(result.access_token){
                localStorage.setItem("access-token", result.access_token);
                req.redirect("/");
            } else {
                console.log("No access token received, try signing up again.")
            }
        }) 
        .catch( err => {
            console.error(err);
            const message = document.getElementById("message");
            message.textContent( err.message );
        })
    });
}

export default signUp;