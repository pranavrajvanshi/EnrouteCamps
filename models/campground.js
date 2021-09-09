var mongoose = require("mongoose");
// Schema setup
var campgroundSchema = new mongoose.Schema({
    Name: String,
    Image: String,
    Desc: String,
    Author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    Comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
