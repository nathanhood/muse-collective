'use strict';


class Audio {

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    this.id = text;
  }

  static create(obj, fn){
    var audio = new Audio();
    audio.createId();
    audio.name = obj.name;
    audio.filePath = obj.filePath;
    audio.x = obj.x;
    audio.y = obj.y;
    audio.width = obj.width;
    audio.height = obj.height;
    audio.classes = obj.classes;
    audio.zIndex = obj.zIndex;
    fn(audio);
  }
}

module.exports = Audio;
