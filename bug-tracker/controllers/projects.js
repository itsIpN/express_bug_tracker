//dependencies
const Bugs = require(`../models/data`);
const User = require(`../models/user-data`);
const Project = require(`../models/project.name`);

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
    Project.find({}, (error, projects) => {
        res.render(`./projects/index.ejs`, { projects, name: ``, user: req.session.user})
    })
})

//filtered index
router.get(`/filtered`, (req, res) => {
    User.findById(req.session.user, (error, user) => {
        Project.find({ user: req.session.user}, (error, projects) => {
            res.render(`./projects/index.ejs`, {projects, name: `${user.name}`, user: req.session.user})
        })
    })
})



//NEW
router.get(`/new`, (req, res) => {
    res.render(`./projects/new.ejs`)
})



//DELETE
router.delete(`/:id`, (req, res) => {
    Project.findByIdAndDelete(req.params.id, (error, deletedProject) => {
        res.redirect(`/main`)
    })
})


//UPDATE
router.put(`:id`, (req, res) => {
    if (req.body.fixed) {
        req.body.fixed = true
    } else {
        req.body.fixed = false
    }
    Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true},
        (error, updatedProject) => {
            res.redirect(`/main/${req.params.id}`)
        }
    )
})



//CREATE
router.post(`/`, (req, res) => {
    req.body.user = req.session.user;
    Project.create(req.body, (err, newProject) => {
        res.redirect(`/main`)
    })
})



//EDIT
router.get(`/:id/edit`, (req, res) => {
    Project.findById(req.params.id, (error, foundProject) => {
        res.render(`./projects/edit.ejs`, {foundProject});
    })
})


//SHOW
router.get(`/:id`, (req, res) => {
    Project.findById(req.params.id, (error, foundProject) => {
        Bugs.find({project: foundProject.title}, (err, foundBug) => {
            User.findById(req.session.user, (err, user) => {
                User.find({}, (err, userList) => {
                    res.render(`./projects/show.ejs`, {foundProject, currentUser: req.session.user, foundBug, role: user.role, userList})
                })
            })            
        })        
    })
})


module.exports = router;