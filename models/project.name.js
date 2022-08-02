const mongoose = require(`mongoose`);
const Project = mongoose.model(`Project`, new mongoose.Schema({
        title: {type: String, unique: true},
        comments: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: `user`}
    })
)

module.exports = Project;