/**
 * Main application file
 */

'use strict';

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/**
 * EXPRESS
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());

/**
 * DB calls
 */

MongoClient.connect('mongodb://localhost:27017/oneview', function(err, db) {
  console.log("Connected to db");
  var markers = db.collection('markers');
  var organizations = db.collection('organizations');
  var regions = db.collection('regions');

  /**
   * API
   */

  app.get('/api/markers', function(req, res, next){
    markers.find({}).toArray(function(err, docs){
      if(err){
        console.log(err);
        next(err);
      }else{
        res.send(docs);
      }
    });
  });

  app.get('/api/organizations', function(req, res, next){
    organizations.find({}).toArray(function(err, docs){
      if(err){
        console.log(err);
        next(err);
      }else{
        res.send(docs);
      }
    });
  });

  app.get('/api/regions', function(req, res, next){
    regions.find({}).toArray(function(err, docs){
      if(err){
        console.log(err);
        next(err);
      }else{
        res.send(docs);
      }
    });
  });

  /**
   * SOCKET IO
   */

  io.on('connection', function (socket) {
    socket.connectedAt = new Date();

    


    // Call onDisconnect.
    socket.on('disconnect', function () {
      console.info('[%s] DISCONNECTED', socket.address);
    });

    console.info('[%s] CONNECTED', socket.address);
  });
});

// Start server
server.listen(3007, 'localhost', function () {
  console.log('App started on http://localhost:3007');
});