'use strict';


class Note {

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    this.id = text;
  }

  static create(obj, fn){
    var note = new Note();
    note.createId();
    note.title = obj.title;
    note.content = obj.content;
    note.x = obj.x;
    note.y = obj.y;
    note.classes = obj.classes;
    note.zIndex = obj.zIndex;
    fn(note);
  }
}

module.exports = Note;
