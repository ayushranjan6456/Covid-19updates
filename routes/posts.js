var express = require('express');
var router = express.Router();
var Post = require('../models/posts');
var Comment = require('../models/comments')

router.get('/posts', function (req, res) {
    Post.find({}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/blog', { posts: post });
        }
    });
});

router.get('/posts/new', isLoggedIn, function (req, res) {
    res.render('posts/new', { currentUser: req.user })
});

router.post('/posts', isLoggedIn, function (req, res) {
    var title = req.body.post.title;
    var thumbnail = req.body.post.thumbnail;
    var desc = req.body.post.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = { title: title, thumbnail: thumbnail, desc: desc, author: author }
    Post.create(newPost, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            console.log(post);
        }
    });
    res.redirect('/posts');
});

router.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id).populate('comments').exec(function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/post', { post: foundpost })
        }
    })
});

router.delete('/posts/:id', checkOwner, function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/posts')
        }
    })
});

router.get('/posts/:id/edit', checkOwner, function (req, res) {
    Post.findById(req.params.id, function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/edit', { post: foundpost })
        }
    })
});

router.put('/posts/:id', checkOwner, function (req, res) {
    var title = req.body.post.title;
    var thumbnail = req.body.post.thumbnail;
    var desc = req.body.post.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = { title: title, thumbnail: thumbnail, desc: desc, author: author }
    Post.findByIdAndUpdate(req.params.id, newPost, function (err, updatedpost) {
        if (err) {
            console.log(err);
        } else {
            console.log(updatedpost)
            res.redirect('/posts/' + req.params.id)
        }
    })
});

//comment Routes

router.get('/posts/:id/comments/new', isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { post: foundpost })
        }
    })
});

router.post('/posts/:id/comments', isLoggedIn, function (req, res) {
    Comment.create(req.body.comment, function (err, newComment) {
        if (err) {
            console.log(err);
        } else {
            console.log(newComment);
            Post.findById(req.params.id, function (err, foundpost) {
                if (err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundpost.comments.push(newComment);
                    foundpost.save(function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('success', 'Comment created')
                            res.redirect('/posts/' + req.params.id);
                        }
                    })
                }
            })
        }
    });

});

router.get('/posts/:id/comments/:comment_id/edit',checkComentOwner , function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect('back')
        }
        else {
            res.render('comments/edit', { post_id: req.params.id, comment: foundComment });
        }
    })

});

router.put('/posts/:id/comments/:comment_id',checkComentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back')
        } else{
            res.redirect('/posts/' + req.params.id)
        }
    })
})

router.delete('/posts/:id/comments/:comment_id',checkComentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back')
        } else{
            req.flash('success', 'Comment deleted')
            res.redirect('/posts/' + req.params.id)
        }
    })
})



//middlewares

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to log in first")
    res.redirect('/login');
}

function checkOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function (err, foundPost) {
            if (err) {
                res.redirect('back')
            } else {
                if (foundPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

function checkComentOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash('error', 'Post not found')
                res.redirect('back')
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Permission Denied')
                    res.redirect('back')
                }
            }
        });
    } else {
        req.flash('error', 'You need to log in first')
        res.redirect('back');
    }
}


module.exports = router;