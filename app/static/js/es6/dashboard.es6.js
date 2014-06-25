/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#create-project-link').click(toggleProjectForm);
    $('.current-projects').on('click', '.delete-project-link', destroyProject);
  }

  function destroyProject(event){
    var projId = $(this).siblings('.project-list-title').attr('data-projId');
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
