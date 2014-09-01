/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('#draft-title').click(editTitle);
    $('#draft-title-edit').on('blur', saveTitle);
    $('#draft-title-edit').keypress(enterSaveTitle);
    $('#toggle-tools').click(toggleTools);
    $('#clear-rhymes').click(clearRhymes);
    $('#dictionary-button').click(getDefinition);
    $('#clear-dictionary').click(clearDefinition);
    $('#save-draft').click(saveDraft);
  }

  var timeoutID;

  function saveDraft(){
    var projId = $('#draft-title').attr('data-id');
    var draft = $('#draft-content').val();
    ajax(`/projects/${projId}/draft`, 'POST', {draft:draft}, html=>{
      $('#draft-background').append(html);
      timeoutID = window.setTimeout(alertFade, 2000);
    });
  }

  function alertFade(){
    $('.save-draft-confirmation').fadeOut('slow');
    $('.save-draft-error').fadeOut('slow');
  }

  /* Wordnik API Below */

  function clearDefinition(){
    $('#dictionary-results').slideToggle();
    $('#dictionary-results').empty();
  }

  function getDefinition(){
    $('#dictionary-results').empty();
    var projId = $('#draft-title').attr('data-id');
    var word = $('#dictionary-input').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=10&includeRelated=false&sourceDictionaries=ahd&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      ajax(`/projects/${projId}/getDefinition`, 'POST', {data:data}, html=>{
        $('#dictionary-results').append(html);
        $('#dictionary-results').slideToggle();
        getRelatedWords();
      });
    });
  }

  function getRelatedWords(){
    var projId = $('#draft-title').attr('data-id');
    var word = $('#dictionary-input').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      ajax(`/projects/${projId}/getRelatedWords`, 'POST', {data:data}, html=>{
        $('#dictionary-results').append(html);
        $('#dictionary-input').val('');
      });
    });
  }


  /* Rhyming Dictionary */

  function clearRhymes(event){
    $('#RhymeBrainInput').val('');
    $('.rhyme-results').slideToggle();
    event.preventDefault();
  }


  /* Project Title */

  function editTitle(){
    $('#draft-title').addClass('hidden');
    $('#draft-title-edit').removeClass('hidden');
    $('#draft-title-edit').focus();
  }

  function toggleTools(event){
    $('#draft-tools').slideToggle();
    event.preventDefault();
  }

  function saveTitle(){
    $(this).addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().text($(this).val());
  }

  function enterSaveTitle(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().text($(this).val());
    }
  }

  function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
  }

})();
