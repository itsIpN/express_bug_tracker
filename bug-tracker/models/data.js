const mongoose = require(`mongoose`);


const Bugs = mongoose.model(`Bugs`, new mongoose.Schema({
    title: String,
    comments: String,
    project: String,
    status: String,
    priority: Number,
    fixed: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: `user`},
    assignedTo: String
}, {timestamps: true}));

module.exports = Bugs;