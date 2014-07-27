/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#create-project-link').click(toggleProjectForm);
    $('.current-projects').on('click', '.delete-project-link', destroyProject);
    $('.view-all-collaborations, .view-all-managed-collaborations').click(showProjectList);
    $('.hide-all-collaborations, .hide-all-managed-collaborations').click(hideProjectList);
  }

  function showProjectList(){
    $(this).hide();
    $(this).next().show();
    if ($(this).hasClass('view-all-collaborations')) {
      $('.collaboration-list').slideToggle();
    } else if ($(this).hasClass('view-all-managed-collaborations')) {
      $('.managed-collaboration-list').slideToggle();
    }
  }

  function hideProjectList(){
    $(this).hide();
    $(this).prev().show();
    if ($(this).hasClass('hide-all-collaborations')) {
      $('.collaboration-list').slideToggle();
    } else if ($(this).hasClass('hide-all-managed-collaborations')) {
      $('.managed-collaboration-list').slideToggle();
    }
  }

  function destroyProject(event){
    var projId = $(this).siblings('.project-list-title-link').children('.project-list-title').attr('data-projId');
    var projContainer = $(this).parent().parent();

    var r = confirm('Are you sure you want to delete this project?');
    if (r === true) {
      ajax(`/projects/${projId}/destroy`, 'POST', {}, ()=>{
        $(projContainer).remove();
      });
    }
    event.preventDefault();
  }

  function toggleProjectForm(event){
    $('.create-project').slideToggle('slow');
    event.preventDefault();
  }

  function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
  }


})();
