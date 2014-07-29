'use strict';

exports.index = (req, res)=>{
  if(req.session.passport.user) {
    res.redirect('/dashboard');
  } else {
    res.render('home/index', {title: 'Muse Collective', user:req.user, message: req.flash('error'), message2: req.flash('loginMessage')});
  }

};
