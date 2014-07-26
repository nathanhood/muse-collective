'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#login-button').hover(colorFadeIn, colorFadeOut);
    $('.scroll').click(pageScroll);
    $('#back-to-top-link').click(pageScroll);
  }


  function colorFadeIn(){
    $(this).animate({backgroundColor: '#1dc16f'}, 250);
  }

  function colorFadeOut(){
    $(this).animate({backgroundColor: '#323232'}, 250);
  }

  function pageScroll(event){
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 700);
  }

})();
