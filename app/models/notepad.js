'use strict';


class Notepad {

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    this.id = text;
  }

  static create(obj, fn){
    var notepad = new Notepad();
    notepad.createId();
    notepad.content = obj.content;
    notepad.x = obj.x;
    notepad.y = obj.y;
    notepad.width = obj.width;
    notepad.height = obj.height;
    notepad.classes = obj.classes;
    notepad.zIndex = obj.zIndex;
    fn(notepad);
  }
}

module.exports = Notepad;
