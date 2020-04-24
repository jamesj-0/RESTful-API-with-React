import router from "./router.js";
import home from "./routes/home.js"
import signUp from "./routes/sign-up.js"
import post from "./routes/post.js"
import logIn from "./routes/log-in.js"
import deleteExample from "./routes/delete.js"
import defaultPage from "./routes/default.js"

const app = router();

app.get("/", home); 
app.get("/sign-up", signUp); 
app.get("/post", post)
app.get("/log-in", logIn); 
app.get("/delete", deleteExample)
app.setDefault(defaultPage)

app.listen();


