import query from "../query.js";

const app = document.querySelector('#wrapper');

const logInPage = `
    <form>
        <label for="email">Email</label>
        <input id="email" type="email" name="email">
        <label for="password">Password</label>
        <input id="password" type="password" name="password">
        <div id="message"></div>
        <button type="submit">Submit</button>
    </form>
`


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
    .then((res) => {console.log(res)})
    .catch((err) => {
      console.error(err);
      document.querySelector("#message").textContent = err.message
    })
    
  })
}

export default logIn;