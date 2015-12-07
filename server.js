(function() {
  'use strict';
  var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 4443;
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/dist'));
  console.log(__dirname + '/dist');

  app.get('*', function(req, res) {
    res.sendfile('./dist/index.html');
  });

  app.listen(port);
  console.log('Listening at ' + port);
})();

