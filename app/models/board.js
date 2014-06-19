'use strict';

var boardCollection = global.nss.db.collection('boards');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Note = traceur.require(__dirname + '/note.js');
var Word = traceur.require(__dirname + '/word.js');
var Photo = traceur.require(__dirname + '/photo.js');
var Audio = traceur.require(__dirname + '/audio.js');
var Notepad = traceur.require(__dirname + '/notepad.js');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');


class Board {
  static create(obj, fn){
    var board = new Board();
    board._id = Mongo.ObjectID(obj._id);
    board.userId = Mongo.ObjectID(obj.userId);
    board.projId = Mongo.ObjectID(obj.projId);
    board.dateCreated = new Date();
    board.title = obj.title;
    board.notes = [];
    board.photos = [];
    board.audio = [];
    board.words = [];
    board.notepads = [];

    board.save(()=>fn(board));
  }

  static findById(id, fn){
    Base.findById(id, boadCollection, Board, fn);
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, boardCollection, Board, fn);
  }


  save(fn){
    boardCollection.save(this, ()=>fn());
  }

  addNotes(obj, fn){
    if(obj.notes.length > 0){
      var newNotes = [];
      obj.notes.forEach(n=>{
        var note = new Note(n);
        this.notes.push(note);
        newNotes.push(note);
      });
      baordCollection.update({_id:this._id},
        { $addToSet: { notes: { $each: newNotes } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }

  addWords(obj, fn){
    if(obj.words.length > 0){
      var newWords = [];
      obj.words.forEach(w=>{
        var word = new Word(w);
        this.words.push(word);
        newWords.push(word);
      });
      boardCollection.update({_id:this._id},
        { $addToSet: { words: { $each: newWords } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }

  addNotepads(obj, fn){
    if(obj.notepads.length > 0){
      var newNotepads = [];
      obj.notepads.forEach(n=>{
        var notepad = new Notepad(n);
        this.notepads.push(notepad);
        newNotepads.push(notepad);
      });
      boardCollection.update({_id:this._id},
        { $addToSet: { notepads: { $each: newNotepads } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }

  addPhoto(obj, fn){
    if(obj.photos.length > 0){
      var newPhotos = [];

      obj.photos.forEach(p=>{
        var photo = new Photo(p);
        this.photos.push(photo);
        newPhotos.push(photo);
      });

      boardCollection.update({_id:this._id},
        { $addToSet: { photos: { $each: newPhotos } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }

  addAudio(obj, fn){
    if(obj.audio.length > 0){
      var newAudio = [];

      obj.audio.forEach(a=>{
        var aud = new Audio(a);
        this.audio.push(aud);
        newAudio.push(aud);
      });

      boardCollection.update({_id:this._id},
        { $addToSet: { audio: { $each: newAudio } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }


  processPhoto(photo, fn){
    if(photo.size){
      var name = crypto.randomBytes(12).toString('hex') + path.extname(photo.originalFilename).toLowerCase();
      var file = `/img/${this.userId}/${this._id}/${name}`;

      var newPhoto = {};
      newPhoto.fileName = name;
      newPhoto.filePath = file;
      newPhoto.origFileName = photo.originalFilename;

      var userDir = `${__dirname}/../static/img/${this.userId}`;
      var projDir = `${userDir}/${this._id}`;
      var fullDir = `${projDir}/${name}`;

      if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
      if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

      fs.renameSync(photo.path, fullDir);
      fn(newPhoto);
      // this.projDir = path.normalize(projDir);
      // this.photos.push(photo);
    }else{
      fn(null);
    }
  }

  processAudio(audio, fn){
    if(audio.size){
      var name = crypto.randomBytes(12).toString('hex') + path.extname(audio.originalFilename).toLowerCase();
      var file = `/audio/${this.userId}/${this._id}/${name}`;

      var newAudio = {};
      newAudio.fileName = name;
      newAudio.filePath = file;
      newAudio.origFileName = audio.originalFilename;

      var userDir = `${__dirname}/../static/audio/${this.userId}`;
      var projDir = `${userDir}/${this._id}`;
      var fullDir = `${projDir}/${name}`;

      if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
      if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

      fs.renameSync(audio.path, fullDir);
      fn(newAudio);

    }else{
      fn(null);
    }
  }


}

module.exports = Board;