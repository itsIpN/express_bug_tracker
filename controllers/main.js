//dependencies
const Bugs = require(`../models/data`);
const User = require(`../models/user-data`);
const moment = require(`moment`)

//router object
const router = require(`express`).Router();

//check user session
router.use(function(req,res, next) {
    if(req.session.user){
        next();
    } else {
        res.redirect(`/user/login`);
    }
})


//index of all
router.get(`/`, (req, res) => {
    Bugs.find({}, (error, bugs) => {
        User.find({}, (err, userList) => {
            res.render(`./main/main.ejs`, { bugs, name: ``, user: req.session.user, userList, moment})
        })
    })
})


//user list & roles
router.get(`/roles`, (req, res) => {
    User.find({}, (error, userList) => {
        User.findById(req.session.user, (err, user) => {
            res.render(`./main/roles.ejs`, { userList, role: user.role })
        })
    })
})










module.exports = router;