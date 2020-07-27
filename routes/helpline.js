var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/download',(req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./files','helpline.pdf');
    console.log(fileLocation);
    res.download(fileLocation, file);
});    

router.get('/helpline', function (req, res) {
    res.render('helpline')
});

module.exports = router