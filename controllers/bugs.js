//dependencies
const Bugs = require(`../models/data`);
const User = require(`../models/user-data`);
const Project = require(`../models/project.name`);
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




//routes
//Induces
//INDEX
//index of all
router.get(`/`, (req, res) => {
    Bugs.find({}, (error, bugs) => {
        User.find({}, (err, userList) => {
            res.render(`./bugs/index.ejs`, { bugs, name: ``, user: req.session.user, userList, moment})
        })
    })
})

//filtered index
router.get(`/filtered`, (req, res) => {
    User.findById(req.session.user, (error, user) => {
        Bugs.find({ assignedTo: req.session.user}, (error, bugs) => {
            res.render(`./bugs/filtered-index.ejs`, {bugs, user, moment})
        })
    })
})

//all unassigned bugs
router.get(`/filtered/unassigned`, (req, res) => {
        Bugs.find({ assignedTo: `unassigned`}, (error, bugs) => {
            res.render(`./bugs/filtered-index.ejs`, {bugs, user: `unassigned`})
        })
})

//NEW
router.get(`/new`, (req, res) => {
    Project.findById(req.query.project, (error, project) => {
        res.render(`./bugs/new.ejs`, { project, user: req.session.user})
    })
})



//DELETE
router.delete(`/:id`, (req, res) => {
    Bugs.findByIdAndDelete(req.params.id, (error, deletedBug) => {
        res.redirect(`/main`)
    })
})


//UPDATE
router.patch(`/:id`, (req, res) => {
    if (req.body.fixed) {
        req.body.fixed = true
    } else {
        req.body.fixed = false
    }
    Bugs.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true},
        (error, updatedBug) => {
            res.redirect(`/index/${req.params.id}`)
        }
    )
})



//CREATE
router.post(`/`, (req, res) => {
    if (req.body.fixed) {
        req.body.fixed = true
    } else {
        req.body.fixed = false
    }
    req.body.user = req.session.user;
    req.body.assignedTo = `unassigned`
    Bugs.create(req.body, (err, newBug) => {
        Project.findOne({title: req.body.project}, (error, foundProject) => {
            res.redirect(`/projects/${foundProject._id}`)
        })
    })
})



//EDIT
router.get(`/:id/edit`, (req, res) => {
    User.find({}, (err, userList) => {
        if(err) {
            console.log(err)
        }        
        Bugs.findById(req.params.id, (error, foundBugs) => {
            User.findById(req.session.user, (err, user) => {
                Project.findOne({title: foundBugs.project}, (errs, foundProject) => {
                    res.render(`./bugs/edit.ejs`, {foundBugs, userList, role: user.role, foundProject});
                })

            })   
        })
    })

})


//SHOW
router.get(`/:id`, (req, res) => {
    Bugs.findById(req.params.id, (error, foundBugs) => {
        User.find({} , (err, foundUser) => {
            User.findById(req.session.user, (err, user) => {
                Project.findOne({title: foundBugs.project}, (errs, foundProject) => {
                    res.render(`./bugs/show.ejs`, {foundBugs, currentUser: req.session.user, foundUser, role: user.role, foundProject})
                })
            })
        })
    })
})


module.exports = router;