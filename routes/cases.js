var express = require('express');
var router = express.Router();
var request = require('request')

router.get('/cases', function (req, res) {
    request('https://api.covid19india.org/v3/data.json', function(err,response, body){
        if(!err && response.statusCode == 200){
            var data = JSON.parse(body)
            res.render('cases', {data: data}); 
        }
    })
    
});



module.exports = router