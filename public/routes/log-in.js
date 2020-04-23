import query from "../query.js";

const app = document.querySelector('#wrapper');

const logInPage = `
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

// TODO: work out why username is required and change that

function logIn() {
  app.innerHTML = logInPage;
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const formObject = Object.fromEntries(new FormData(event.target))
    query("/signup", {
      "headers": {"content-type": "application/json"},
      "body": JSON.stringify(formObject),
      "method": "POST"
    })
    .then((res) => {console.log(res)}
    /* TODO: add token to local storage, redirect */
    /* Get user id too */
    )
    .catch((err) => {
      console.error(err);
      document.querySelector("#message").textContent = err.message
    })
    
  })
}

export default logIn;