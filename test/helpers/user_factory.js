'use strict';

var traceur = require('traceur');
var fs = require('fs');
var async = require('async');
var Model;

module.exports = (model, fn)=>{
  Model = traceur.require(__dirname + '/../../app/models/' + model + '.js');
  var records = fs.readFileSync(__dirname + '/../../db/' + model + '.json', 'utf8');
  records = JSON.parse(records);
  async.map(records, iterator, (e,objs)=>fn(objs));
};

function iterator(record, fn){
  var user = new Model();
  //would need to link to passport.js in order to test this. moving on for now
  user.save(()=>fn(user));
}
