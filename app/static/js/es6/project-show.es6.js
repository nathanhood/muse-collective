/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('.project-board-container').on('click', '.edit-board-list-title', editBoardTitle);
    $('.project-board-container').on('blur', '.board-list-title-edit', saveBoardTitle);
    $('.project-board-container').on('click', '.save-board-list-title', saveBoardTitle);
    $('.board-list-title-edit').keypress(enterSaveBoardTitle);
    $('#click-to-edit-title').click(editProjectTitle);
    $('.container').on('blur', '.project-title-edit', saveProjectTitle);
    $('.container').on('click', '#save-project-title', saveProjectTitle);
    $('.project-title-edit').keypress(enterSaveProjectTitle);
    $('.project-collaborators').on('click', '.remove-collaborator', removeCollaborator);
    $('.project-board-container').on('click', '.delete-board-link', destroyBoard);
  }

  function destroyBoard(event){
    var boardId = $(this).siblings('.board-list-title-link').attr('data-boardId');
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

  function editBoardTitle(){
    $(this).siblings('.board-list-title-link').addClass('hidden');
    $(this).siblings('.board-list-title-edit').removeClass('hidden').focus();
    $(this).addClass('hidden');
    $(this).next().removeClass('hidden');
  }

  function editProjectTitle(){
    $(this).addClass('hidden');
    $(this).next().removeClass('hidden');
    $(this).prev().prev().addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().focus();
  }

  function saveBoardTitle(){
    var newTitle = $(this).parent().children('.board-list-title-edit').val().trim();
    console.log(newTitle);
    var boardId = $(this).parent().children('.board-list-title-link').attr('data-boardId');
    $(this).parent().children('.save-board-list-title').addClass('hidden');
    $(this).parent().children('.edit-board-list-title').removeClass('hidden');
    $(this).parent().children('.board-list-title-edit').addClass('hidden');
    $(this).parent().children('.board-list-title-link').removeClass('hidden');
    $(this).parent().children('.board-list-title-link').children('.board-list-title').text(newTitle);
    ajax(`/boards/${boardId}/updateTitle`, 'POST', {title:newTitle}, jsonObj=>{
      console.log(jsonObj);
    }, 'json');
  }

  function enterSaveBoardTitle(event){
    var newTitle = $(this).val().trim();
    var boardId = $(this).prev().attr('data-boardId');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $('.save-board-list-title').addClass('hidden');
      $('.edit-board-list-title').removeClass('hidden');
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().children('.board-list-title').text(newTitle);
      ajax(`/boards/${boardId}/updateTitle`, 'POST', {title:newTitle}, jsonObj=>{
        console.log(jsonObj);
      }, 'json');
    }
  }

  function saveProjectTitle(){
    var newTitle = $('.project-title-edit').val().trim();
    var projId = $('#project-title').attr('data-projId');
    $('.project-title-edit').addClass('hidden');
    $('#save-project-title').addClass('hidden');
    $('#click-to-edit-title').removeClass('hidden');
    $('#project-title').removeClass('hidden');
    $('#project-title').text(newTitle);
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
