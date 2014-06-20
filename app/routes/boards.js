'use strict';


exports.show = (req, res)=>{
  res.render('boards/index', {title:'Board'});
};

exports.create = (req, res)=>{
  // res.redirect(`/boards/${board._id}`);
};

exports.update = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.destroy = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};
