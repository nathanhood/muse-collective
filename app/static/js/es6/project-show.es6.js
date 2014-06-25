/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('.project-board-container').on('click', '.board-list-title', editTitle);
    $('.project-board-container').on('blur', '.board-list-title-edit', saveTitle);
    $('.board-list-title-edit').keypress(enterSaveTitle);
    $('#project-title').click(editTitle);
    $('.container').on('blur', '.project-title-edit', saveProjectTitle);
    $('.project-title-edit').keypress(enterSaveProjectTitle);
    $('.project-collaborators').on('click', '.remove-collaborator', removeCollaborator);
    $('.project-board-container').on('click', '.delete-board-link', destroyBoard);
  }

  function destroyBoard(event){
    var boardId = $(this).siblings('.board-list-title').attr('data-boardId');
    var boardContainer = $(this).parent().parent();

    var r = confirm('Are you sure you want to delete this board?');
    if (r === true) {
      ajax(`/boards/${boardId}/destroy`, 'POST', {}, ()=>{
        $(boardContainer).remove();
      });
    }
    event.preventDefault();
  }

  function removeCollaborator(event){
    var projId = $('#project-title').attr('data-projId');
    var collabId = $(this).attr('data-collaboratorId');
    var image = $(this).prev().prev('img');
    var email = $(this).prev('span');
    var button = $(this);
    ajax(`/projects/${projId}/removeCollaborator`, 'POST', {collaboratorId:collabId}, ()=>{
      console.log('RETURNED AJAX RESPONSE');
      $(image).remove();
      $(email).remove();
      $(button).remove();
    });
    event.preventDefault();
  }

  function editTitle(){
    $(this).addClass('hidden');
    $(this).next().removeClass('hidden');
    $(this).next().focus();
  }

  function saveTitle(){
    var newTitle = $(this).val().trim();
    var boardId = $(this).prev().attr('data-boardId');
    $(this).addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().text(newTitle);
    ajax(`/boards/${boardId}/updateTitle`, 'POST', {title:newTitle}, jsonObj=>{
      console.log(jsonObj);
    }, 'json');
  }

  function enterSaveTitle(event){
    var newTitle = $(this).val().trim();
    var boardId = $(this).prev().attr('data-boardId');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().text($(this).val());
      ajax(`/boards/${boardId}/updateTitle`, 'POST', {title:newTitle}, jsonObj=>{
        console.log(jsonObj);
      }, 'json');
    }
  }

  function saveProjectTitle(){
    var newTitle = $(this).val().trim();
    var projId = $('#project-title').attr('data-projId');
    $(this).addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().text(newTitle);
    ajax(`/projects/${projId}/updateTitle`, 'POST', {title:newTitle}, ()=>{});
  }

  function enterSaveProjectTitle(event){
    var newTitle = $(this).val().trim();
    var projId = $('#project-title').attr('data-projId');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().text($(this).val());
      ajax(`/projects/${projId}/updateTitle`, 'POST', {title:newTitle}, ()=>{});
    }
  }

  function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
  }


})();
