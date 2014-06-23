/* jshint unused:false */
/* global counter */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#bt-menu').on('click', '#choose-upload-image', upload);
    $('#bt-menu').on('click', '#choose-upload-audio', uploadAudio);
  }

  function checkNewElements(){
    $('.new').css('z-index', counter);
    $('.new').removeClass('new');
  }

  function upload(){
    // status('Choose a file');

    // Check to see when a user has selected a file
    var timerId;
    timerId = setInterval(function() {
	    if($('#choose-upload-image').val() !== '') {
          clearInterval(timerId);

          $('#upload-image').submit();
      }
    }, 500);

    $('#upload-image').submit(function() {
        // status('uploading the file ...');

        $(this).ajaxSubmit({

            // error: function(xhr) {
		        //   status('Error: ' + xhr.status);
            // },

            success: function(html) {
		          $('#board').append(html);
              $('#bt-menu').removeClass('bt-menu-open');
              $('#bt-menu').addClass('bt-menu-close');
              $('#image-container').remove();
              $('.resizable').resizable({
                aspectRatio: true
              });
              $('.draggable').draggable();
              checkNewElements();
            }
	      });

	    // Have to stop the form from submitting and causing
	    // a page refresh - don't forget this
	    return false;
    });

    // function status(message) {
	  //   $('#status').text(message);
    // }
  }



  function uploadAudio(){
    // Check to see when a user has selected a file
    var timerId;
    timerId = setInterval(function() {
      if($('#choose-upload-audio').val() !== '') {
          clearInterval(timerId);

          $('#upload-audio').submit();
      }
    }, 500);

    $('#upload-audio').submit(function() {
        $(this).ajaxSubmit({

            success: function(html) {
              $('#board').append(html);
              $('#bt-menu').removeClass('bt-menu-open');
              $('#bt-menu').addClass('bt-menu-close');
              $('#audio-container').remove();
              $('.resizable').resizable({
                aspectRatio: true
              });
              $('.draggable').draggable();
              checkNewElements();
            }
        });

      // Have to stop the form from submitting and causing
      // a page refresh - don't forget this
      return false;
    });
  }

})();
