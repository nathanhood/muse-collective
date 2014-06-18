'use strict';

var projectCollection = global.nss.db.collection('projects');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Note = traceur.require(__dirname + '/note.js');
var Word = traceur.require(__dirname + '/word.js');
var Mongo = require('mongodb');

class Project {
  static create(obj, fn){
    var project = new Project();
    project._id = Mongo.ObjectID(obj._id);
    project.userId = Mongo.ObjectID(obj.userId);
    project.dateCreated = new Date();
    project.title = obj.title;
    project.type = obj.type;
    project.notes = [];
    project.images = [];
    project.audio = [];
    project.words = [];
    project.notepads = [];
    project.collaborators = [];
    project.critics = [];
    project.publicPrivate = obj.privacy;
    project.status = obj.status;

    project.save(()=>fn(project));
  }

  static findById(id, fn){
    Base.findById(id, projectCollection, Project, fn);
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, projectCollection, Project, fn);
  }


  save(fn){
    projectCollection.save(this, ()=>fn());
  }

  addNotes(obj, fn){
    if(obj.notes.length > 0){
      var newNotes = [];
      obj.notes.forEach(n=>{
        var note = new Note(n);
        this.notes.push(note);
        newNotes.push(note);
      });
      projectCollection.update({_id:this._id},
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
      projectCollection.update({_id:this._id},
        { $addToSet: { words: { $each: newWords } } },
        ()=>fn(this));
    }else{
      fn(this);
    }
  }

}

module.exports = Project;
