const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        "owner_id": { type: String, required: true}, 
        "name": { type: String, required: true},
        "description": { type: String, required: true, default: " " },
        "date": { type: Date, required: true, default: Date.now}, 
        "duration": { type: Number, required: true, default: 60},
        "priority": { type: Number, required: true, default: 5},
        "solved": { type: Boolean, required: true, default: false},
        "recycling_bin": { type: Boolean, required: true, default: false}
    }
)

module.exports = mongoose.model("Task", TaskSchema)