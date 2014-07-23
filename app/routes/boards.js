'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');
var multiparty = require('multiparty');
var _ = require('lodash');

exports.show = (req, res)=>{
  Board.findById(req.params.boardId, (err, board)=>{
    var boardId = board._id.toString();
    res.render('boards/show', {title:`MC: Board ${board.title}`, board:board, boardId:boardId});
  });
};

exports.create = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    var boardObj = project;
    boardObj.projId = boardObj._id;
    boardObj = _.omit(boardObj, '_id').valueOf();
    Board.create(boardObj, board=>{
      project.addBoardId(board._id, ()=>{
        res.redirect(`/boards/${board._id}`);
      });
    });
  });
};

exports.update = (req, res)=>{
  var body = req.body;

  Board.findById(req.params.boardId, (err, board)=>{
    body._id = board._id;
    body.userId = board.userId;
    body.projId = board.projId;
    body.title = board.title;

    board.replace(()=>{
      Board.create(body, newBoard=>{
        newBoard.addNotes(body, ()=>{
          newBoard.addWords(body, ()=>{
            newBoard.addNotepads(body, ()=>{
              newBoard.addPhoto(body, ()=>{
                newBoard.addAudio(body, ()=>{
                  newBoard.updateTitle(body, ()=>{
                    newBoard.save(()=>{
                      res.send(newBoard);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.destroy = (req, res)=>{
  Board.findById(req.params.boardId, (err, board)=>{
    board.destroy(()=>{
      res.send({});
    });
  });
};

exports.processPhoto = (req, res)=>{
  var id = req.params.boardId;
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    Board.findById(id, (err, board)=>{
      board.processPhoto(files.photo[0], photoObj=>{
        res.render('boards/photo', {photoPath:photoObj.filePath});
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

exports.photoContainer = (req, res)=>{
  res.render('boards/photo-container', {boardId:req.params.boardId});
};

exports.audioContainer = (req, res)=>{
  res.render('boards/audio-container', {boardId:req.params.boardId});
};

exports.removeFileFromDirectory = (req, res)=>{
  Board.removeFileFromDirectory(req.body.filePath, (err)=>{
    res.send({});
  });
};

exports.retrieveDraft = (req, res)=>{
  // Project.findByBoardId(req.params.boardId, project=>{
    res.render('boards/notepad');
  // });
};

exports.updateTitle = (req, res)=>{
  Board.findById(req.params.boardId, (err, board)=>{
    board.updateTitle(req.body, ()=>{
      board.save(()=>{
        res.send(board);
      });
    });
  });
};
