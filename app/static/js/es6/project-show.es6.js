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
