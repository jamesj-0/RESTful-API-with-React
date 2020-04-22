import query from '../query.js'

const wrapper = document.querySelector('#wrapper');
const nav = document.querySelector('#navigation');

function home() {
   writeToNav()
   writeToWrapper() 
}

function writeToNav(params) {
  // check auth token and display accordingly
}

function writeToWrapper() {
    // get db and display anything returned or first 10 things returned
    wrapper.innerHTML = `
    <h1>Home</h1> 
    <a href="/sign-up">Create an account</a>
    `;

}
export default home;