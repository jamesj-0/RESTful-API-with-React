import router from "./router.js";
import home from "./routes/home.js"
import signUp from "./routes/sign-up.js"
import post from "./routes/post.js"
import logIn from "./routes/log-in.js"
// import logIn from ""
// import createExample from ""
// import updateExample from ""

const app = router();

app.get("/", home); 
app.get("/sign-up", signUp); 
app.get("/post", post)
app.get("/log-in", logIn); 
// app.get("/create-example", createExample); 
// app.get("/update-entry", updateExample);

app.listen();


