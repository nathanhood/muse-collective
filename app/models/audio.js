'use strict';


class Audio {

  constructor(obj){
    this.id = this.createId();
    this.fileName = obj.fileName;
    this.filePath = obj.filePath;
    this.origFileName = obj.origFileName;
    this.x = obj.x;
    this.y = obj.y;
    this.classes = obj.classes;
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

module.exports = Audio;
