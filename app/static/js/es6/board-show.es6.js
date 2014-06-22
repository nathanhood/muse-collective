/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    $('.resizable').resizable({
      aspectRatio: true
    });
    $('.draggable').draggable();
    $('#board').on('mousedown', '.resizable', resize);
    $('#board').on('mousedown', '.draggable', drag);
    $('#board').on('mousedown', '.draggable', zCounter);
    $('#board').on('click', '.sticky-note-title, .sticky-note-text', editNoteTitle);
    $('#board').on('blur', '.sticky-note-title-edit, .sticky-note-text-edit', saveNoteTitle);
    $('.sticky-note-title-edit, .sticky-note-text-edit').keypress(enterSaveNoteTitle);
    $('#search-word').click(getDefinition);
    $('#search-word').click(getRelatedWords);
    $('#search-word').click(getWordExample);
    $('#search-rhymes').click(getRhymes);
    /* Random Poetry */
    $('#find-random-poetry').click(getRandomNouns);
    $('#find-random-poetry').click(getRandomVerbs);
    $('#find-random-poetry').click(getRandomAdjectives);
    $('#find-random-poetry').click(getRandomAdverbs);
    $('#find-random-poetry').click(getRandomAuxiliaries);
    $('#find-random-poetry').click(getRandomPrepositions);
    /* Dynamically Generating Content */
    $('.bt-menu-trigger').click(menuZIndex);
    $('#notes').click(appendNoteContainer);
    $('#bt-menu').on('click', '.yellow', addYellowNote);
    $('#bt-menu').on('click', '.blue', addBlueNote);
    $('#bt-menu').on('click', '.green', addGreenNote);
    $('#bt-menu').on('click', '.sticky-note-delete', removeNote);
    $('#bt-menu').on('click', '.bt-overlay', removeNoteContainer);
  }

  function menuZIndex(){
    $('.bt-menu').css('z-index', counter);
  }


  /* ============== STICKY NOTES =============== */

  function removeNote(){
    $(this).remove();
  }

  function removeNoteContainer(){
    $('#note-container').remove();
  }

  function addGreenNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note green draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Title</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function addBlueNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note blue draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Title</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function addYellowNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note yellow draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Click Here</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function appendNoteContainer(){
    var container = `<div id='note-container'>
                      <div class='inner-container'>
                      <a href='#'><div class='sticky-note yellow'></div></a>
                      <a href='#'><div class='sticky-note blue'></div></a>
                      <a href='#'><div class='sticky-note green'></div></a>
                      </div>
                      </div>`;
    $('.bt-overlay').append(container);
    $('#note-container').slideToggle('slow');
  }





  /* Refresh draggable/resizable methods every mousedown - Dynamically created elements work now */

  function drag(){
    $('.draggable').draggable();
  }

  function resize(){
    $('.resizable').resizable({
      aspectRatio: true
    });
  }

  /* Sticky Note Functionality Below */

  var counter = 0;
  function zCounter(){
    counter++;
    $(this).css('z-index', counter);
  }

  function editNoteTitle(){
    $(this).addClass('hidden');
    $(this).next('textarea').removeClass('hidden');
    $(this).next('textarea').val($(this).text()).focus();
    var background = $(this).parent().css('background-color');
    $(this).next('textarea').css('background-color', background);
  }

  function saveNoteTitle(){
    $(this).addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().text($(this).val());
  }

  function enterSaveNoteTitle(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().text($(this).val());
    }
  }


  /* Wordnik API Below */

  function getDefinition(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=10&includeRelated=false&sourceDictionaries=ahd&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }

  function getRelatedWords(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }

  function getWordExample(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/topExample?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }


  /* Random Poetry API calls - wordnik */

  function getRandomNouns(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="noun draggable">').text(obj.word);
        $('#random-words').append(div);
      });
    });
  }

  function getRandomVerbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log('===========Verbs=========');
      console.log(data);
    });
  }

  function getRandomAdjectives(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log('===========Adjectives=========');
      console.log(data);
    });
  }

  function getRandomAdverbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adverb&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log('===========Adverbs=========');
      console.log(data);
    });
  }

  function getRandomAuxiliaries(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=auxiliary-verb&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log('===========Auxiliaries=========');
      console.log(data);
    });
  }

  function getRandomPrepositions(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=preposition&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log('===========Prepositions=========');
      console.log(data);
    });
  }

  /* RhymeBrain Below */

  function getRhymes(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://rhymebrain.com/talk?function=getRhymes&maxResults=20&word=${word}&jsonp=RhymeBrainResponse`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }


})();
