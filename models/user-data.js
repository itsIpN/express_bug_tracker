const mongoose = require(`mongoose`);
const userSchema = mongoose.model(`User`, new mongoose.Schema({
    firstName: { type: String, required: true, trim: true}, 
    lastName: { type: String, required: true, trim: true},
    title: { type: String, required: true},
    email: { type: String, required: true, unique: true}, 
    password: { type: String, required: true},
    role: String,
})
)

module.exports = userSchema;