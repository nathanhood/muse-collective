'use strict';


class Photo {

  createId(){
    var text='';
    var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 6; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    this.id = text;
  }

  static create(obj, fn){
    var photo = new Photo();
    photo.createId();
    photo.name = obj.name;
    photo.filePath = obj.filePath;
    photo.x = obj.x;
    photo.y = obj.y;
    photo.width = obj.width;
    photo.height = obj.height;
    photo.classes = obj.classes;
    photo.zIndex = obj.zIndex;
    fn(photo);
  }

}

module.exports = Photo;
