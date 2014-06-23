'use strict';

var projectCollection = global.nss.db.collection('projects');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var rimraf = require('rimraf');

class Project {
  static create(obj, fn){
    var project = new Project();
    project._id = Mongo.ObjectID(obj._id);
    project.userId = Mongo.ObjectID(obj.userId);
    project.dateCreated = new Date();
    project.title = obj.title;
    project.type = obj.type;
    project.draftText = null;
    project.draftAudio = null;
    project.boards = [];
    project.collaborators = [];
    project.critics = [];
    project.privacy = obj.privacy;
    project.status = obj.status;

    project.save(()=>fn(project));
  }

  static findById(id, fn){
    Base.findById(id, projectCollection, Project, fn);
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, projectCollection, Project, fn);
  }

  static findByBoardId(boardId, fn){
    boardId = Mongo.ObjectID(boardId);
    projectCollection.findOne({boards:boardId}, (err, project)=>{
      fn(project);
    });
  }


  save(fn){
    projectCollection.save(this, ()=>fn());
  }

  destroy(fn){
    var audioPath = path.normalize(`${__dirname}/../static/audio/${this.userId}/${this._id}`);
    var imagePath = path.normalize(`${__dirname}/../static/img/${this.userId}/${this._id}`);
    rimraf(audioPath, (err)=>{
      rimraf(imagePath, (err)=>{
        projectCollection.remove({_id:this._id}, (err, writeResult)=>{
          fn(writeResult);
        });
      });
    });
  }

  updateTitle(obj, fn){
    this.title = obj.title;
    fn(this);
  }

  addCollaborator(collaboratorId, fn){
    this.collaborators.push(collaboratorId);
    fn(this);
  }

  addCritic(criticId, fn){
    this.critics.push(criticId);
    fn(this);
  }

  updatePrivacy(obj, fn){
    this.privacy = obj.privacy;
    fn(this);
  }

  updateStatus(obj, fn){
    this.status = obj.status;
    fn(this);
  }

  addBoardId(boardId, fn){
    this.boards.push(boardId);
    fn(this);
  }

  updateDraftText(obj, fn){
    this.draftText = obj.draftText;
    fn(this);
  }

  updateDraftAudio(audio, fn){
    if(this.draftAudio){
      var normPath = path.normalize(`${__dirname}/../static/${this.draftAudio.filePath}`);

      rimraf(normPath, (err)=>{
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
          this.draftAudio = newAudio;
          fn(this);

        }else{
          fn(null);
        }
      });
    } else {
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
        this.draftAudio = newAudio;
        fn(this);

      }else{
        fn(null);
      }
    }
  }


}

module.exports = Project;
