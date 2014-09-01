'use strict';

var userCollection = global.nss.db.collection('users');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var rimraf = require('rimraf');

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
      displayName: String
    };
    this.twitter = {
      id: String,
      token: String,
      displayName: String,
      username: String
    };
    this.location = null;
    this.friends = [];
    this.projects = [];
    this.meetups = [];
    this.accountType = null;
    this.influences = [];
    this.genres = [];
    this.bio = null;
    this.image = null;

  }

  // generating a hash
  generateHash(password){
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(password){
      return bcrypt.compareSync(password, this.local.password);
  }

  changePassword(obj, fn){
    var isMatch = bcrypt.compareSync(obj.oldPassword, this.local.password);
    if(isMatch){
      this.local.password = this.generateHash(obj.newPassword);
      fn(null);
    }else{
      fn('err');
    }
  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }

  updateLocation(obj, fn){
    this.location = obj.location;
    fn(this);
  }

  addFriend(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null, null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null, null); return;}
    this.friends.push(id);
    fn(this);
  }

  addProject(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null, null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null, null); return;}
    this.projects.push(id);
    fn(this);
  }

  addInfluence(obj, fn){
    var influence = obj.influence.trim();
    this.influences.push(influence);
    fn(this);
  }

  addGenre(obj, fn){
    var genre = obj.genre;
    this.genres.push(genre);
    fn(this);
  }

  updateBio(obj, fn){
    this.bio = obj.bio;
    fn(this);
  }

  updatePhoto(photo, fn){
    if(this.image){
      console.log('============ THIS.IMAGE==========');
      var normPath = path.normalize(`${__dirname}/../static/${this.image.filePath}`);

      rimraf(normPath, (err)=>{
        if(photo.size){
          var name = crypto.randomBytes(12).toString('hex') + path.extname(photo.originalFilename).toLowerCase();
          var file = `/img/${this._id}/${name}`;

          var newPhoto = {};
          newPhoto.fileName = name;
          newPhoto.filePath = file;
          newPhoto.origFileName = photo.originalFilename;

          var userDir = `${__dirname}/../static/img/${this._id}`;
          // var projDir = `${userDir}/${this._id}`;
          var fullDir = `${userDir}/${name}`;

          if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
          // if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

          fs.renameSync(photo.path, fullDir);
          this.image = newPhoto;
          fn(this);

        }else{
          fn(null);
        }
      });
    } else {
      if(photo.size){
        console.log(photo);
        var name = crypto.randomBytes(12).toString('hex') + path.extname(photo.originalFilename).toLowerCase();
        var file = `/img/${this._id}/${name}`;

        var newPhoto = {};
        newPhoto.fileName = name;
        newPhoto.filePath = file;
        newPhoto.origFileName = photo.originalFilename;

        var userDir = `${__dirname}/../static/img/${this._id}`;
        // var projDir = `${userDir}/${this._id}`;
        var fullDir = `${userDir}/${name}`;

        if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
        // if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

        fs.renameSync(photo.path, fullDir);
        this.image = newPhoto;
        console.log('============ USER ===========');
        console.log(this);
        fn(this);
      }else{
        fn(null);
      }
    }
  }

  static findByTwitterId(id, fn){
    userCollection.findOne({'twitter.id':id}, (err, user)=>{
      fn(err, user);
    });
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

  static findAllById(array, fn){
    userCollection.find({_id: { $in: array }}).toArray((err, users)=>{
      fn(users);
    });
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }
}

module.exports = User;
