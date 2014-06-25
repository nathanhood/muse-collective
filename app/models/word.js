'use strict';


class Word {
  constructor(obj){
    this.id = this.createId();
    this.content = obj.content;
    this.x = obj.x;
    this.y = obj.y;
    this.classes = [];
    // if(obj.classes.length > 0){
    //   obj.classes.forEach(c=>{this.classes.push(c);});
    //   this.zIndex = obj.zIndex;
    // }
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

module.exports = Word;
