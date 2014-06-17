'use strict';


class Word {

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    this.id = text;
  }

  static create(obj, fn){
    var word = new Word();
    word.createId();
    word.content = obj.content;
    word.x = obj.x;
    word.y = obj.y;
    word.classes = obj.classes;
    word.zIndex = obj.zIndex;
    fn(word);
  }
}

module.exports = Word;
