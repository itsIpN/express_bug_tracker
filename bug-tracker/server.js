//Dependencies
const express = require(`express`);
const mongoose = require(`mongoose`);
const methodOverride = require(`method-override`);
const bugTracker = require(`./controllers/bugs`);
const userSession = require(`./controllers/users`);
const main = require(`./controllers/main`);
const project = require(`./controllers/projects`);
require(`dotenv`).config();
const session = require(`express-session`);


const app = express();

const { MONGOURL, PORT, SECRET } = process.env;

//config
app.set(`view engine`, `ejs`);
mongoose.connect(MONGOURL);
mongoose.connection.on(`connected`, () => {
    console.log(`connected to MongoDB`)
})

mongoose.connection.on(`disconnected`, () => {
    console.log(`DB connection disconnected`)
})

mongoose.connection.on(`error`, (error) => {
    console.log(`MongoDB connection error` + error.message)
})

app.use(express.urlencoded({extended: false}));
app.use(methodOverride(`_method`));
app.use(express.static(`public`));


//session
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(async function(req, res, next){
    if(req.session && req.session.user) {
        const user = await require(`./models/user-data`).findById(req.session.user);
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }
    next()
})


//controllers
app.get(`/`, (req, res) => {
    res.redirect(`/user/login`);
});

app.use(`/index`, bugTracker);
app.use(`/user`, userSession);
app.use(`/main`, main);
app.use(`/projects`, project);


//PORT
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})