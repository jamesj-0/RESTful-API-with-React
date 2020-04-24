import query from "../query.js";

const wrapper = document.querySelector("#wrapper");
const nav = document.querySelector("#navigation");

const loggedIn = `
<button class="link" id="log-out">
    <a>
        Log Out
    </a>
</button>

<button class="link"><a href="post">Create new post</a></button>
`;

const loggedOut = `
<button class="log-in link">
    <a href='/log-in'>
    Log In
    </a>
</button>
<button class="sign-up link">
    <a href='/sign-up'>
    Sign Up
    </a>
</button>
`;

const allCode = `
<div id="message"></div>
<ul></ul>
`;

function defaultPage({redirect}) { 
    writeToNav(redirect);
    writeToWrapper();
}


function writeToNav(redirect) {
  // check auth token and display accordingly
  const token = localStorage.getItem("access-token");
  // console.log('token ', !!token, token === 'undefined', typeof token)
  if (token === "undefined" || !token) {
      nav.innerHTML = loggedOut;
  } else {
      nav.innerHTML = loggedIn;
      nav.querySelector("#log-out").addEventListener("click", () => {
          window.localStorage.clear();
          redirect("/");
      });
  }
}

function writeToWrapper() {
  wrapper.innerHTML = `<h1>404 Page not found</h1>`
  wrapper.style.color = "black";

}

export default defaultPage