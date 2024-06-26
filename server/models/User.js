const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        "email": { type: String, required: true}, 
        "password": { type: String, required: true},
        "name": { type: String, required: true},
        "language": { type: String, required: true, default: "en"}, 
        "task_Ids": [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
    }
)

module.exports = mongoose.model("User", UserSchema)