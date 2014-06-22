'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');
var multiparty = require('multiparty');

exports.show = (req, res)=>{
  res.render('boards/show', {title:'Board', boardId:req.params.boardId});
};

exports.create = (req, res)=>{
  Project.findById(req.body._id, (err, project)=>{
    Board.create(project, board=>{
      res.send(board);
    });
  });
};

exports.update = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.destroy = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.processPhoto = (req, res)=>{
  var id = req.params.boardId;
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    Board.findById(id, (err, board)=>{
      board.processPhoto(files.photo[0], photoObj=>{
        res.render('boards/image', {imagePath:photoObj.filePath});
      });
    });
  });
};

exports.processAudio = (req, res)=>{
  var id = req.params.boardId;
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    Board.findById(id, (err, board)=>{
      board.processAudio(files.audio[0], audioObj=>{
        res.render('boards/audio', {audioPath:audioObj.filePath});
      });
    });
  });
};

exports.imageContainer = (req, res)=>{
  res.render('boards/image-container', {boardId:req.params.boardId});
};

exports.audioContainer = (req, res)=>{
  res.render('boards/audio-container', {boardId:req.params.boardId});
};

exports.removeFileFromDirectory = (req, res)=>{
  Board.removeFileFromDirectory(req.body.filePath, (err)=>{
    res.send({});
  });
};
