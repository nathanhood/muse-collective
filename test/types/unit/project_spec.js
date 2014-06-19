/* global describe, before, beforeEach, it, after*/
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'write-aid-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var Mongo = require('mongodb');
var cp = require('child_process');
var fs = require('fs');

var User;
var Project;
var Note;

describe('projects', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      Note = traceur.require(__dirname + '/../../../app/models/note.js');
      done();
    });
  });


  beforeEach(function(done){
    global.nss.db.collection('projects').drop(function(){
      factory('project', function(projects){
        // factory('note', function(notes){
          done();
        // });
      });
    });
  });


  describe('.create', function(){
    it('should successfully create a project', function(done){
      Project.create({'userId': '53a0c3c135451bfc446534e8', 'title': 'story 1', 'type': 'short story', 'privacy': 'private', 'status': 'finished'}, function(project){
        expect(project).to.be.instanceof(Project);
        expect(project._id).to.be.instanceof(Mongo.ObjectID);
        expect(project.title).to.equal('story 1');
        expect(project.type).to.equal('short story');
        expect(project.notes).to.have.length(0);
        expect(project.photos).to.have.length(0);
        expect(project.audio).to.have.length(0);
        expect(project.words).to.have.length(0);
        expect(project.notepads).to.have.length(0);
        expect(project.collaborators).to.have.length(0);
        expect(project.critics).to.have.length(0);
        expect(project.publicPrivate).to.equal('private');
        expect(project.status).to.equal('finished');
        expect(project.userId).to.deep.equal(Mongo.ObjectID('53a0c3c135451bfc446534e8'));
        done();
      });
    });
  });

  describe('.findAllByUserId', function(){
    it('should find projects by user id', function(done){
      Project.findAllByUserId('53a0c3c135451bfc446534e8', function(projects){
        expect(projects).to.have.length(2);
        expect(projects[0]).to.be.instanceof(Project);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a project by Object Id', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        expect(project).to.be.instanceof(Project);
        expect(project.title).to.equal('song idea 1');
        done();
      });
    });
  });

  describe('#addNotes', function(){
    it('should add note objects to notes array', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'notes':[{'title':'Example Title', 'content':'This is an example note...', 'x':'230px', 'y':'72.1px', 'classes':['draggable', 'sticky-note', 'yellow'], 'zIndex':'3'},
        {'title':'Example Title 2', 'content':'This is another example note...', 'x':'100px', 'y':'210px', 'classes':['draggable', 'sticky-note', 'blue'], 'zIndex':'1'}]};

        project.addNotes(body, function(p){
          expect(p.notes).to.have.length(2);
          expect(p.notes[0].x).to.equal('230px');
          expect(p.notes[0].y).to.equal('72.1px');
          expect(p.notes[0].title).to.equal('Example Title');
          expect(p.notes[0].content).to.equal('This is an example note...');
          expect(p.notes[0].classes[0]).to.deep.equal('draggable');
          expect(p.notes[0].zIndex).to.equal('3');
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should NOT add objects to notes array - without errors', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'notes':[]};

        project.addNotes(body, function(p){
          expect(p.notes).to.have.length(0);
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });


  describe('#addNotepads', function(){
    it('should add notepad objects to notepads array', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'notepads':[{'content':'This is an example notepad. There should be a lot more text than this...', 'x':'230px', 'y':'72.1px', 'classes':['resizable', 'draggable', 'notepad'], 'zIndex':'0'},
        {'content':'This is another example note...', 'x':'100px', 'y':'210px', 'classes':['draggable', 'sticky-note', 'blue'], 'zIndex':'1'}]};

        project.addNotepads(body, function(p){
          expect(p.notepads).to.have.length(2);
          expect(p.notepads[0].x).to.equal('230px');
          expect(p.notepads[0].y).to.equal('72.1px');
          expect(p.notepads[0].content).to.equal('This is an example notepad. There should be a lot more text than this...');
          expect(p.notepads[0].classes[0]).to.deep.equal('resizable');
          expect(p.notepads[0].zIndex).to.equal('0');
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should NOT add objects to notepads array - NO NOTEPAD', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'notepads':[]};

        project.addNotepads(body, function(p){
          expect(p.notepads).to.have.length(0);
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });


  describe('#addWords', function(){
    it('should add word objects to words array', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'words':[{'content':'bird', 'x':'230px', 'y':'72.1px', 'classes':['word', 'noun', 'draggable'], 'zIndex':'3'},
        {'content':'frightened', 'x':'100px', 'y':'210px', 'classes':['word', 'noun', 'draggable'], 'zIndex':'1'}]};

        project.addWords(body, function(p){
          expect(p.words).to.have.length(2);
          expect(p.words[0].x).to.equal('230px');
          expect(p.words[0].y).to.equal('72.1px');
          expect(p.words[0].content).to.equal('bird');
          expect(p.words[0].classes[0]).to.deep.equal('word');
          expect(p.words[0].zIndex).to.equal('3');
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should NOT add objects to words array - without errors', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'words':[]};

        project.addWords(body, function(p){
          expect(p.words).to.have.length(0);
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });



  describe('#processPhoto', function(){
    before(function(done){
      global.nss.db.collection('projects').drop(function(){
        cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
          done();
        });
      });
    });


    after(function(done){
      cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });


    it('should process new photo and move into directory /img/userId/projId/${fileName} - absolute photo path', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        // var fields = {name:['test1']};
        var files = {photo:[{originalFilename:'test1-DELETE.jpg', path:__dirname + '/../../fixtures/copy/test1-DELETE.jpg', size:10}]};
        // fields.photo = files.photo;

        project.processPhoto(files.photo[0], function(newPhoto){
          var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/'+newPhoto.fileName+'');
          expect(imgExists).to.be.true;
          done();
        });
      });
    });

    it('should NOT process photo - NO PHOTO', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        // var fields = {name:['tile']};
        var files = {photo:[{size:0}]};
        // fields.photo = files.photo;

        project.processPhoto(files.photo[0], function(photo){
          expect(photo).to.be.null;
          done();
        });
      });
    });
  });



  describe('#addPhoto', function(){
    before(function(done){
      global.nss.db.collection('projects').drop(function(){
        cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
          done();
        });
      });
    });


    after(function(done){
      cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });


    it('should add new photo object to photos array in project', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var files = {photo:[{originalFilename:'test1-DELETE.jpg', path:__dirname + '/../../fixtures/copy/test1-DELETE.jpg', size:10}]};

        project.processPhoto(files.photo[0], function(newPhoto){
          var body = {'photos':[{'fileName':newPhoto.fileName, 'filePath':newPhoto.filePath, 'origFileName':newPhoto.origFileName,
                      'x':'247px', 'y':'15px', 'width':'200px', 'height':'400px', 'classes':['image-container', 'draggable', 'resizable'], 'zIndex': '2'}]};

          project.addPhoto(body, function(p){
            expect(p.photos).to.have.length(1);
            expect(p.photos[0].x).to.equal('247px');
            expect(p.photos[0].y).to.equal('15px');
            expect(p.photos[0].fileName).to.equal(newPhoto.fileName);
            expect(p.photos[0].classes[0]).to.deep.equal('image-container');
            expect(p.photos[0].zIndex).to.equal('2');
            expect(p._id).to.be.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });

    it('should NOT add new photo object to photos array in project - NO PHOTO', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
          var body = {'photos':[]};

        project.addPhoto(body, function(p){
          expect(p.photos).to.have.length(0);
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });



  describe('#processAudio', function(){
    before(function(done){
      global.nss.db.collection('projects').drop(function(){
        cp.execFile(__dirname + '/../../fixtures/audio-before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
          done();
        });
      });
    });


    after(function(done){
      cp.execFile(__dirname + '/../../fixtures/audio-after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });


    it('should process new audio file and move into directory /audio/userId/projId/${fileName} - absolute photo path', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        // var fields = {name:['test1']};
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};
        // fields.photo = files.photo;

        project.processAudio(files.audio[0], function(newAudio){
          var imgExists = fs.existsSync(__dirname + '/../../../app/static/audio/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/'+newAudio.fileName+'');
          expect(imgExists).to.be.true;
          done();
        });
      });
    });

    it('should NOT process photo - NO PHOTO', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        // var fields = {name:['tile']};
        var files = {audio:[{size:0}]};
        // fields.photo = files.photo;

        project.processAudio(files.audio[0], function(audio){
          expect(audio).to.be.null;
          done();
        });
      });
    });
  });



  describe('#addAudio', function(){
    before(function(done){
      global.nss.db.collection('projects').drop(function(){
        cp.execFile(__dirname + '/../../fixtures/audio-before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
          done();
        });
      });
    });


    after(function(done){
      cp.execFile(__dirname + '/../../fixtures/audio-after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });


    it('should add new audio object to audio array in project', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};

        project.processAudio(files.audio[0], function(newAudio){
          var body = {'audio':[{'fileName':newAudio.fileName, 'filePath':newAudio.filePath, 'origFileName':newAudio.origFileName,
                      'x':'247px', 'y':'15px', 'classes':['image-container', 'draggable', 'resizable'], 'zIndex': '2'}]};

          project.addAudio(body, function(p){
            expect(p.audio).to.have.length(1);
            expect(p.audio[0].x).to.equal('247px');
            expect(p.audio[0].y).to.equal('15px');
            expect(p.audio[0].fileName).to.equal(newAudio.fileName);
            expect(p.audio[0].classes[0]).to.deep.equal('image-container');
            expect(p.audio[0].zIndex).to.equal('2');
            expect(p._id).to.be.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });

    it('should NOT add new audio object to audio array in project - NO AUDIO', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
          var body = {'audio':[]};

        project.addAudio(body, function(p){
          expect(p.audio).to.have.length(0);
          expect(p._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });



});
