'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#login-button').hover(colorFadeIn, colorFadeOut);
  }


  function colorFadeIn(){
    $(this).animate({backgroundColor: '#1dc16f'}, 250);
  }

  function colorFadeOut(){
    $(this).animate({backgroundColor: '#323232'}, 250);
  }

})();
