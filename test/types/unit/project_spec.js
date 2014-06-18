/* global describe, before, beforeEach, it*/
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'write-aid-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var Mongo = require('mongodb');

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
      // global.nss.db.collection('notes').drop(function(){
        factory('project', function(projects){
          // factory('note', function(notes){
            done();
          // });
        });
      // });
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
        expect(project.images).to.have.length(0);
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
  });

  describe('#addNotes', function(){
    it('should add 0 objects to notes array without errors', function(done){
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
  });

  describe('#addWords', function(){
    it('should add 0 objects to words array without errors', function(done){
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

  

});
