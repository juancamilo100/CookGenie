var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
  // res.render('index', { title: 'Express' });
});

router.get('/alexaTest', function(req, res, next) {
  res.send({texToSpeech: "Hello world"});
  // res.render('index', { title: 'Express' });
});


module.exports = router;
