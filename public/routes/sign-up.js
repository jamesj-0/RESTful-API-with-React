import query from "../query.js";

const app = document.querySelector('#wrapper');

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

function signUp( req ){
    app.innerHTML = signUpPage;
    const form = document.querySelector("form");
    form.addEventListener("submit", event => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData);
        query("/signup", {
            "headers" : { "content-type": "application/json" }, 
            "body": JSON.stringify(formObject),
            "method": "POST" 
        })
        .then( result => {
            console.log("OUR RESULT & token:", result, result.token);
            console.log("RESULT TYPE", typeof result);
            if( typeof result === typeof {} && !result.hasOwnProperty("token") ){
                console.log("SIGNUP FAILED FOR SOME REASON");
                throw new Error ("Signup failed");
            } 
            if(result.token){
                localStorage.setItem("access-token", result.token);
                localStorage.setItem("user-id", result.user_id);
                console.log("Redirecting to home route")
                req.redirect("/");
            } else {
                console.log("No access token received, try signing up again.")
            }
        }) 
        .catch( err => {
            console.error(err);
            const message = document.getElementById("message");
            message.textContent = err.stack;
        })
    });
}

export default signUp;