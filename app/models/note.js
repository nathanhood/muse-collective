'use strict';


class Note {
  constructor(obj){
    this.id = this.createId();
    // this.title = obj.title;
    this.content = obj.content;
    this.x = obj.x;
    this.y = obj.y;
    this.classes = [];
    obj.classes.forEach(c=>{this.classes.push(c);});
    this.zIndex = obj.zIndex;
  }

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    return text;
  }

}

module.exports = Note;
