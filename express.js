const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const mysql = require("mysql2");
const userRouter = require("./routers/postRouter.js")
const getRouters = require("./routers/getRouters.js")
const userAuth = require("./routers/userAuth.js")
const session = require("express-session")

const app = express()

app.use(cors({
    origin: [
      'http://localhost:8080',
      'https://minivcontact.netlify.app'
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));
app.use(session({
    secret: 'wow very secret',
    cookie: {
        maxAge: 600000,
        secure: true
    },
    saveUninitialized: false,
    resave: false,
    unset: 'destroy'
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", getRouters)
app.use("/register", userRouter)
app.use("/user", userAuth)



app.listen(2000, () => {
    console.log("http:localhost:2000");
})