
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


function writeToNav(redirect) {
  const nav = document.querySelector("#navigation");

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

export default writeToNav;