import query from "../query.js";

const app = document.querySelector('#wrapper');

const signUpPage = /*html*/
`
    <form>
        <label for="username">Username        
        <span aria-hidden="true">*</span>
        </label>
        <input id="username" class="input" type="text" name="username" placeholder="e.g. John Smith" required />
        <div id="nameError" class="error"></div>
        <label for="email">Email
        <span aria-hidden="true">*</span>
        </label>
        <input id="email" class="input" type="email" aria-describedby="emailError" name="email" placeholder="e.g. hello@johnsmith.com" required />
        <label for="password">Password
        <span aria-hidden="true">*</span>
        </label>
        <input id="password" 
        type="password" 
        name="password"
        aria-describedby="passwordRequirements passwordError"
        required
        pattern="(?=.*[A-z])(?=.*\d)[A-z\d]+"
        minlength="8"
        placeholder="Make it memorable"
        />
        <div id="passwordTime" class="password__time">Your password should contain at least 8 characters, including a letter and number.</div>
    
        <div id="message"></div>
        <button type="submit">Submit</button>
    </form>
`
function validate(input, test){
    input.nextElementSibling.textContent = '';
    if (test) {
      input.style.borderColor = "hsl(106, 100%, 30%)";
      return true;
    } else {
      input.style.borderColor = "transparent";
      return false;
    }
  }

function signUp( req ){
    app.innerHTML = signUpPage;

    const form = document.querySelector("form");
    const nameInput = form.querySelector("#username");
    const nameRegex = /^[a-zA-Z-.' ]{2,}$/;
    const emailInput = form.querySelector("#email");
    const emailRegex = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    const passwordInput = form.querySelector("#password");
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const errorMessage = {
        username: "Check your name doesn't contain odd characters",
        email: "This needs to include an @ and domain",
        password: "Try adding an unusual word",
    }

    form.setAttribute("novalidate", "");

    nameInput.addEventListener("input", () => {
        valid.username = validate(nameInput, nameRegex.test(nameInput.value));
      });
      
      emailInput.addEventListener("input", () => {
        valid.email = validate(emailInput, emailRegex.test(emailInput.value));
      });
      
      passwordInput.addEventListener("input", () => {
        valid.password = validate(passwordInput, passwordRegex.test(passwordInput.value));
    })

    let valid = {
        username: false, 
        email: false, 
        password: false,
      }

    form.addEventListener("submit", event => {
        if (Object.values(valid).includes(false)) {
            event.preventDefault();
            for (const key in valid) {
              if (!valid[key]) {
                const input = document.getElementById(key);
                input.style.borderColor = "hsl(200, 100%, 45%)";
                input.textContent = errorMessage[key];
              }
            }
        } else {

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
                localStorage.setItem("user-name", result.user_name);
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
    }
});
}

export default signUp;

