'use strict';

var userCollection = global.nss.db.collection('users');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt');

class User {
  constructor(){
    this.local = {
      email: String,
      password: String
    };
    this.facebook = {
      id: String,
      token: String,
      email: String,
      firstName: String,
      lastName: String
    };
  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }

  // generating a hash
  generateHash(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(password) {
      return bcrypt.compareSync(password, this.local.password);
  }

  static findByFacebookId(id, fn){
    userCollection.findOne({'facebook.id':id}, (err, user)=>{
      fn(err, user);
    });
  }

  static findByEmail(email, fn){
    userCollection.findOne({'local.email': email}, (err, user)=>{
      fn(err, user);
    });
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }
}

module.exports = User;
