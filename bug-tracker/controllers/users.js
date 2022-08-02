//dependencies
const User = require(`../models/user-data`);
const Bugs = require(`../models/data`);
const bcrypt = require(`bcrypt`);
const SALTROUNDS = 10;
const moment = require(`moment`)

//router object
const router = require(`express`).Router();

//routes
//INDEX (get login form)
router.get(`/login`, (req, res) => {
    res.render(`./users/login.ejs`, {err: ``})
})




//NEW (create new user)
router.get(`/register`, (req, res) => {
    res.render(`./users/register.ejs`, {err: ``})
})



//DELETE (delete session / sign out)
router.get(`/logout`, (req, res) => {
    req.session.destroy(() => {
        res.redirect(`/main`)
    })
})


//EDIT any user profile
router.get(`/:id/edit`, (req, res) => {
    User.findById(req.params.id, (error, user) => {
        res.render(`./users/edit.ejs`, {user});    
    })
})

//EDIT your user profile
router.get(`/profile/edit`, (req, res) => {
    User.findOne({ _id: req.session.user}, (err, foundUser) => {
        res.render(`./users/profile-edit.ejs`, {foundUser})
    })
})


//UPDATE (update user profile?)




//UPDATE any user profile
router.patch(`/:id`, (req, res) => {
    User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true},
        (error, updatedBug) => {
            res.redirect(`/main/roles`)
        }
    )
})

//CREATE
//create new session
router.post(`/login`, (req, res) => {
    // find user in database by email or username
    User.findOne({ email: req.body.email }, `+password`, (err, foundUser) => {
        if(!foundUser) return res.render(`./users/login.ejs`, {err: `Invalid credentials`})
        if(!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.render(`./users/login.ejs`, {err: `Invalid credentials`})
        }
        req.session.user = foundUser._id;
        res.redirect(`/main`)
    })
})


//create new user
router.post(`/register`, (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALTROUNDS));
    req.body.password = hash;
    req.body.role = `User`;
    User.create(req.body, (err, user) => {
        if(err) {
            res.render(`./users/register.ejs`, { err: err})
        } else {
            req.session.user = user._id // this is a login
            res.redirect(`/main`)
        }
    })    
})



//SHOW current user profile
router.get(`/profile`, (req, res) => {
    User.findById(req.session.user, (err, user) => {
        res.render(`./users/profile.ejs`)
    })
})


//show any user profile
router.get(`/:id`, (req, res) => {
    User.findById(req.params.id, (error, user) => {
        Bugs.find({assignedTo: user._id}, (err, foundBug) => {
            res.render(`./users/show.ejs`, { user, foundBug })
        })        
    })
})


//show bugs assigned to any user
router.get(`/:id/filtered`, (req, res) => {
    User.findById(req.params.id, (error, user) => {
        Bugs.find({ assignedTo: req.params.id}, (error, bugs) => {
            res.render(`./bugs/filtered-index.ejs`, {bugs, user, moment})
        })
    })
})


module.exports = router 