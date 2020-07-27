var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/download',(req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./files','guidelines.pdf');
    console.log(fileLocation);
    res.download(fileLocation, file);
}); 
router.get('/contact', function (req, res) {
    res.render('contact')
});

module.exports = router