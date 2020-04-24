import writeToNav from "../lib/write-to-nav.js"

const wrapper = document.querySelector("#wrapper");

function defaultPage({redirect}) { 
    writeToNav(redirect);
    writeToWrapper();
}

function writeToWrapper() {
  wrapper.innerHTML = `<h1>404 Page not found</h1>`
  wrapper.style.color = "black";

}

export default defaultPage