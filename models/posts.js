var mongoose = require("mongoose");
var Comment = require("./comments.js");

var postSchema = new mongoose.Schema({
    title: String,
    thumbnail: {type: String},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    desc: {type: String, default:'N'},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

module.exports = mongoose.model("Post", postSchema);