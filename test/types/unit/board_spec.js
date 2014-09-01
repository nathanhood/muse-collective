/* global describe, before, beforeEach, it, after */
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
var Board;

describe('boards', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      Board = traceur.require(__dirname + '/../../../app/models/board.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('boards').drop(function(){
      global.nss.db.collection('projects').drop(function(){
        factory('board', function(boards){
          factory('project', function(boards){
            done();
          });
        });
      });
    });
  });


  describe('.create', function(){
    it('should successfully create a board and push id into board array', function(done){
      Board.create({'userId': '53a0c3c135451bfc446534e8', 'projId':'53a0f350140b1f584c054ed6', 'title': 'untitled'}, function(board){
        Project.findById('53a0f350140b1f584c054ed6', function(err, project){
          project.addBoardId(board._id, function(){
            expect(project.boards).to.have.length(1);
            expect(board).to.be.instanceof(Board);
            expect(board._id).to.be.instanceof(Mongo.ObjectID);
            expect(board.title).to.equal('Untitled');
            expect(board.dateCreated).to.be.instanceof(Date);
            expect(board.notes).to.have.length(0);
            expect(board.photos).to.have.length(0);
            expect(board.audio).to.have.length(0);
            expect(board.words).to.have.length(0);
            expect(board.notepads).to.have.length(0);
            expect(board.userId).to.deep.equal(Mongo.ObjectID('53a0c3c135451bfc446534e8'));
            expect(board.projId).to.deep.equal(Mongo.ObjectID('53a0f350140b1f584c054ed6'));
            done();
          });
        });
      });
    });
  });

  describe('.findAllByUserId', function(){
    it('should find boards by user id', function(done){
      Board.findAllByUserId('53a0c3c135451bfc446534e8', function(boards){
        expect(boards).to.have.length(2);
        expect(boards[0]).to.be.instanceof(Board);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a board by Object Id', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        expect(board).to.be.instanceof(Board);
        expect(board.title).to.equal('Untitled');
        done();
      });
    });
  });

  describe('#addNotes', function(){
    it('should add note objects to notes array', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var body = {'notes':[{'content':'This is an example note...', 'x':'230px', 'y':'72.1px', 'classes':['draggable', 'sticky-note', 'yellow'], 'zIndex':'3'},
        {'title':'Example Title 2', 'content':'This is another example note...', 'x':'100px', 'y':'210px', 'classes':['draggable', 'sticky-note', 'blue'], 'zIndex':'1'}]};

        board.addNotes(body, function(b){
          expect(b.notes).to.have.length(2);
          expect(b.notes[0].x).to.equal('230px');
          expect(b.notes[0].y).to.equal('72.1px');
          expect(b.notes[0].content).to.equal('This is an example note...');
          expect(b.notes[0].classes[0]).to.deep.equal('draggable');
          expect(b.notes[0].zIndex).to.equal('3');
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should NOT add objects to notes array - without errors', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var body = {'notes':[]};

        board.addNotes(body, function(b){
          expect(b.notes).to.have.length(0);
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });


  describe('#addNotepads', function(){
    it('should add notepad objects to notepads array', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var body = {'notepads':[{'content':'This is an example notepad. There should be a lot more text than this...', 'x':'230px', 'y':'72.1px', 'classes':['resizable', 'draggable', 'notepad'], 'zIndex':'0'},
        {'content':'This is another example note...', 'x':'100px', 'y':'210px', 'classes':['draggable', 'sticky-note', 'blue'], 'zIndex':'1'}]};

        board.addNotepads(body, function(b){
          expect(b.notepads).to.have.length(2);
          expect(b.notepads[0].x).to.equal('230px');
          expect(b.notepads[0].y).to.equal('72.1px');
          expect(b.notepads[0].content).to.equal('This is an example notepad. There should be a lot more text than this...');
          expect(b.notepads[0].classes[0]).to.deep.equal('resizable');
          expect(b.notepads[0].zIndex).to.equal('0');
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should NOT add objects to notepads array - NO NOTEPAD', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var body = {'notepads':[]};

        board.addNotepads(body, function(b){
          expect(b.notepads).to.have.length(0);
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });


  describe('#processPhoto', function(){
    before(function(done){
      global.nss.db.collection('boards').drop(function(){
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


    it('should process new photo and move into directory /img/userId/projId/boardId/${fileName} - absolute photo path', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        // var fields = {name:['test1']};
        var files = {photo:[{originalFilename:'test1-DELETE.jpg', path:__dirname + '/../../fixtures/copy/test1-DELETE.jpg', size:10}]};
        // fields.photo = files.photo;

        board.processPhoto(files.photo[0], function(newPhoto){
          var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/53a0f350140b1f584c054ed9/'+newPhoto.fileName+'');
          expect(imgExists).to.be.true;
          done();
        });
      });
    });

    it('should NOT process photo - NO PHOTO', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        // var fields = {name:['tile']};
        var files = {photo:[{size:0}]};
        // fields.photo = files.photo;

        board.processPhoto(files.photo[0], function(photo){
          expect(photo).to.be.null;
          done();
        });
      });
    });
  });



  describe('#addPhoto', function(){
    before(function(done){
      global.nss.db.collection('boards').drop(function(){
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


    it('should add new photo object to photos array in board', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var files = {photo:[{originalFilename:'test1-DELETE.jpg', path:__dirname + '/../../fixtures/copy/test1-DELETE.jpg', size:10}]};

        board.processPhoto(files.photo[0], function(newPhoto){
          var body = {'photos':[{'fileName':newPhoto.fileName, 'filePath':newPhoto.filePath, 'origFileName':newPhoto.origFileName,
                      'x':'247px', 'y':'15px', 'width':'200px', 'height':'400px', 'classes':['image-container', 'draggable', 'resizable'], 'zIndex': '2'}]};

          board.addPhoto(body, function(b){
            expect(b.photos).to.have.length(1);
            expect(b.photos[0].x).to.equal('247px');
            expect(b.photos[0].y).to.equal('15px');
            expect(b.photos[0].fileName).to.equal(newPhoto.fileName);
            expect(b.photos[0].classes[0]).to.deep.equal('image-container');
            expect(b.photos[0].zIndex).to.equal('2');
            expect(b._id).to.be.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });

    it('should NOT add new photo object to photos array in project - NO PHOTO', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
          var body = {'photos':[]};

        board.addPhoto(body, function(b){
          expect(b.photos).to.have.length(0);
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });



  describe('#processAudio', function(){
    before(function(done){
      global.nss.db.collection('boards').drop(function(){
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


    it('should process new audio file and move into directory /audio/userId/projId/boardId/${fileName} - absolute photo path', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        // var fields = {name:['test1']};
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};
        // fields.photo = files.photo;

        board.processAudio(files.audio[0], function(newAudio){
          var imgExists = fs.existsSync(__dirname + '/../../../app/static/audio/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/53a0f350140b1f584c054ed9/'+newAudio.fileName+'');
          expect(imgExists).to.be.true;
          done();
        });
      });
    });

    it('should NOT process photo - NO PHOTO', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        // var fields = {name:['tile']};
        var files = {audio:[{size:0}]};
        // fields.photo = files.photo;

        board.processAudio(files.audio[0], function(audio){
          expect(audio).to.be.null;
          done();
        });
      });
    });
  });



  describe('#addAudio', function(){
    before(function(done){
      global.nss.db.collection('boards').drop(function(){
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


    it('should add new audio object to audio array in board', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};

        board.processAudio(files.audio[0], function(newAudio){
          var body = {'audio':[{'fileName':newAudio.fileName, 'filePath':newAudio.filePath, 'origFileName':newAudio.origFileName,
                      'x':'247px', 'y':'15px', 'classes':['image-container', 'draggable', 'resizable'], 'zIndex': '2'}]};

          board.addAudio(body, function(b){
            expect(b.audio).to.have.length(1);
            expect(b.audio[0].x).to.equal('247px');
            expect(b.audio[0].y).to.equal('15px');
            expect(b.audio[0].fileName).to.equal(newAudio.fileName);
            expect(b.audio[0].classes[0]).to.deep.equal('image-container');
            expect(b.audio[0].zIndex).to.equal('2');
            expect(b._id).to.be.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });

    it('should NOT add new audio object to audio array in board - NO AUDIO', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
          var body = {'audio':[]};

        board.addAudio(body, function(b){
          expect(b.audio).to.have.length(0);
          expect(b._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });

  describe('#destroy', function(){
    it('should successfully remove a board from the DB & directories from img and audio dir', function(done){
      Board.findById('53a0f350140b1f584c054ed9', function(err, board){
        board.destroy(function(writeResult){
          Board.findById('53a0f350140b1f584c054ed9', function(err, b){
            expect(b).to.equal(null);
            expect(writeResult).to.equal(1);
            done();
          });
        });
      });
    });
  });



});
