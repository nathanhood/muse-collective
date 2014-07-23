/* jshint unused:false */

'use strict';

var counter = 0;

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){

  $(document).ready(init);

  function init(){
    $('.resizable').resizable({
      aspectRatio: true
    });
    $('.draggable').draggable();
    calculateZIndex();
    $('#board').on('mousedown', '.resizable', resize);
    $('#board').on('mousedown', '.draggable', drag);
    $('#board').on('mousedown', '.draggable', zCounter);
    // $('#board').on('click', '.sticky-note-title, .sticky-note-text', editNoteTitle);
    // $('#board').on('blur', '.sticky-note-title-edit, .sticky-note-text-edit', saveNoteTitle);
    // $('.sticky-note-title-edit, .sticky-note-text-edit').keypress(enterSaveNoteTitle);
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
    /* Dynamically Generating Notes */
    $('.bt-menu-trigger').click(menuZIndex);
    $('#notes').click(appendNoteContainer);
    $('#bt-menu').on('click', '.yellow', addYellowNote);
    $('#bt-menu').on('click', '.blue', addBlueNote);
    $('#bt-menu').on('click', '.green', addGreenNote);
    $('#board').on('click', '.sticky-note-delete', removeNote);
    $('#bt-menu').on('click', '.bt-overlay', removeNoteContainer);

    /* Dynamically Generating Images */
    $('#photos').click(appendPhotoContainer);
    $('#bt-menu').on('click', '#choose-upload-photo', chooseFile);
    $('#board').on('click', '.photo-delete', removePhoto);
    $('#bt-menu').on('click', '.bt-overlay', removePhotoContainer);

    /* Dynamically Generating Audio */
    $('#audio').click(appendAudioContainer);
    $('#bt-menu').on('click', '#choose-upload-audio', chooseFile);
    $('#bt-menu').on('click', '.bt-overlay', removeAudioContainer);
    $('#board').on('click', '.audio-delete', removeAudio);

    /* Dynamically Generating Words */
    /* Random Poetry */
    $('#random-poetry').click(getRandomNouns);
    $('#random-poetry').click(getRandomVerbs);
    $('#random-poetry').click(getRandomAdjectives);
    $('#random-poetry').click(getRandomAdverbs);
    $('#random-poetry').click(getRandomAuxiliaries);
    $('#random-poetry').click(getRandomPrepositions);
    $('#random-poetry').click(getRandomPronouns);
    $('#random-poetry').click(getArticles);
    $('#random-poetry').click(hideMenu);
    $('#board').on('click', '.word-delete', removeWord);
    $('#random-poetry').click(toggleContainer);
    $('#random-words').on('mousedown', '.word', checkForMove);
    $('#random-words').on('mouseup', '.word', unbindMouseMove);


    /* Dynamically Generating Notepad */
    $('#notepad').click(retrieveDraft);
    $('#board').on('click', '.notepad-delete', removeNotepad);

    /* Saving Board */
    $('#save-board').click(saveBoard);
  }

  function calculateZIndex(){
    var divs = $('div');
    var highestValue = 0;
    divs.each((i, div)=>{
      var zIndex = $(div).css('z-index');
      if(zIndex > highestValue && zIndex !== 'auto' && zIndex !== '90'){
        highestValue = zIndex;
      }
    });
    counter = highestValue * 1;
  }

  function menuZIndex(){
    $('.bt-menu').css('z-index', (counter+30));
  }

  function chooseFile(event){
    $('#bt-menu').removeClass('bt-menu-close');
    $('#bt-menu').addClass('bt-menu-open');
    event.stopPropagation();
  }

  function zCounter(){
    counter++;
    $(this).css('z-index', counter);
    $('#save-board').css('z-index', counter++);
  }

  function checkNewElements(){
    var newClass = $('.new');
    console.log(newClass);
    console.log(counter);
    $('.new').css('z-index', counter++);
    $('.new').removeClass('new');
  }

  /* ================ SAVE BOARD ================= */

  function saveBoard(){
    var boardId = $('#board').attr('data-id');

    var yellowNotes = collectNotes('yellow');
    var blueNotes = collectNotes('blue');
    var greenNotes = collectNotes('green');
    var notes = $.merge(yellowNotes, blueNotes);
    notes = $.merge(notes, greenNotes);
    var photos = collectPhotos();
    var audio = collectAudio();
    var notepads = collectNotepads();
    var words = collectWords();

    ajax(`/boards/${boardId}`, 'POST', {notes:notes, photos:photos,
    audio:audio, notepads:notepads, words:words}, jsonObj=>{
      window.location = `/projects/${jsonObj.projId}`;
    }, 'json');
  }

  function collectWords(){
    var words = $('.word').toArray().map(w=>{
      var obj = {};
      obj.content = $(w).text();
      obj.x = $(w).css('left');
      obj.y = $(w).css('top');
      obj.zIndex = $(w).css('zIndex');
      return obj;
    });
    return words;
  }

  function collectNotepads(){
    var drafts = $('.notepad-container').toArray().map(d=>{
      if(d){
        var obj = {};
        obj.content = $(d).find('textarea').val();
        obj.x = $(d).css('left');
        obj.y = $(d).css('top');
        obj.width = $(d).css('width');
        obj.height = $(d).css('height');
        obj.zIndex = $(d).css('z-index');
        return obj;
      }
    });
    return drafts;
  }

  function collectAudio(){
    var soundFiles = $('.audio-container').toArray().map(a=>{
      if(a){
        var obj = {};
        obj.filePath = $(a).children('audio').attr('src');
        var name = $(a).children('audio').attr('src').split('/');
        obj.fileName = name[5];
        obj.x = $(a).css('left');
        obj.y = $(a).css('top');
        obj.zIndex = $(a).css('z-index');
        return obj;
      }
    });
    return soundFiles;
  }

  function collectPhotos(){
    var images = $('.photo-container').toArray().map(img=>{
      if(img){
        var obj = {};
        obj.filePath = $(img).children('img').attr('src');
        var name = $(img).children('img').attr('src').split('/');
        obj.fileName = name[5];
        obj.x = $(img).css('left');
        obj.y = $(img).css('top');
        obj.width = $(img).css('width');
        obj.height = $(img).css('height');
        obj.zIndex = $(img).css('z-index');
        return obj;
      }
    });
    return images;
  }

  function collectNotes(color){
    var notes = $(`.sticky-note.${color}`).toArray().map(n=>{
      if(n){
        var obj = {};
        obj.classes = [];
        obj.classes.push(color);
        obj.content = $(n).find('textarea').val();
        obj.x = $(n).css('left');
        obj.y = $(n).css('top');
        obj.zIndex = $(n).css('z-index');
        // $(n).attr('style').split(';').map((value)=>{
        //   var array = value.split(':');
        //   array = array.map((v)=>{return v.trim();});
        //   obj[array[0]] = array[1];
        // });
        return obj;
      }
    });
    return notes;
  }

  /* ================= DRAFT =============== */

  function retrieveDraft(){
    var boardId = $('#board').attr('data-id');
    ajax(`/boards/${boardId}/retrieveDraft`, 'POST', {}, html=>{
      $('#board').append(html);
      $('.draggable').draggable();
      checkNewElements();
    });
  }

  function removeNotepad(){
    $(this).parents('.notepad-container').remove();
  }


  /* ================= RANDOM POETRY ============= */

  /* Random Poetry API calls - wordnik */

  function unbindMouseMove(){
    $(window).unbind('mousemove');
  }

  function checkForMove(){
    $(this).mousemove(function() {
        $(this).css('position', 'absolute');
        $(this).unbind('mousemove');
    });
  }

  function toggleContainer(){
    $('#random-words').css('display', 'none');
    console.log('inside if statement');
    $('#random-words').slideToggle('slow');
  }

  function removeWord(){
    $(this).parent('.word').remove();
  }

  function hideMenu(){
    $('#bt-menu').removeClass('bt-menu-open');
    $('#bt-menu').addClass('bt-menu-close');
  }

  function getArticles(){
    for(var i = 0; i < 2; i++){
      let div = $('<div class="word article draggable">').text('the');
      div = $(div).append('<div class="word-delete">');
      $('#prepositions-container').append(div);
    }
    for(var j = 0; j < 2; j++){
      let div = $('<div class="word article draggable">').text('an');
      div = $(div).append('<div class="word-delete">');
      $('#auxiliaries-container').append(div);
    }
    for(var y = 0; y < 2; y++){
      let div = $('<div class="word article draggable">').text('a');
      div = $(div).append('<div class="word-delete">');
      $('#adverbs-container').append(div);
    }

  }

  function getRandomNouns(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=14&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word noun draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#nouns-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomVerbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word verb draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#verbs-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomAdjectives(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word adjective draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#adjectives-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomAdverbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adverb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word adverb draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#adverbs-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomPronouns(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=pronoun&minCorpusCount=100000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=4&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word pronoun draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#pronouns-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomAuxiliaries(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=auxiliary-verb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word auxiliary draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#auxiliaries-container').append(div);
        $('.draggable').draggable();
      });
    });
  }

  function getRandomPrepositions(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=preposition&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word preposition draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#prepositions-container').append(div);
        $('.draggable').draggable();
      });
    });
  }



/* ================== AUDIO ================= */

  function appendAudioContainer(){
    var boardId = $('#board').attr('data-id');
    ajax(`/boards/${boardId}/audioContainer`, 'POST', null, html=>{
      $('.bt-overlay').append(html);
      $('#audio-container').slideToggle('slow');
    });
  }

  function removeAudioContainer(){
    $('#audio-container').remove();
  }

  function removeAudio(){
    var filePath = $(this).next('audio').attr('src');
    ajax(`/boards/removeDirFile`, 'POST', 'filePath='+filePath, ()=>{
      $(this).parents('.audio-container').remove();
    });
  }


/* =============== IMAGES ==================== */

  function removePhoto(){
    var filePath = $(this).next('img').attr('src');
    ajax(`/boards/removeDirFile`, 'POST', 'filePath='+filePath, ()=>{
      $(this).parents('.photo-container').remove();
    });
  }

  function appendPhotoContainer(){
    var boardId = $('#board').attr('data-id');
    ajax(`/boards/${boardId}/photoContainer`, 'POST', null, html=>{
      $('.bt-overlay').append(html);
      $('#photo-container').slideToggle('slow');
    });
  }

  function removePhotoContainer(){
    $('#photo-container').remove();
  }




  /* ============== STICKY NOTES =============== */

  function removeNote(){
    $(this).parents('.sticky-note').remove();
  }

  function removeNoteContainer(){
    $('#note-container').remove();
  }

  function addGreenNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note green draggable new', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <textarea class='sticky-note-title-edit', resize=none, maxlength='70'>Add Text</textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    checkNewElements();
    event.preventDefault();
  }

  function addBlueNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note blue draggable new', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <textarea class='sticky-note-title-edit', resize=none, maxlength='70'>Add Text</textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    checkNewElements();
    event.preventDefault();
  }

  function addYellowNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note yellow draggable new', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <textarea class='sticky-note-title-edit', resize=none, maxlength='70'>Add Text</textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    checkNewElements();
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


  // function editNoteTitle(){
  //   $(this).addClass('hidden');
  //   $(this).next('textarea').removeClass('hidden');
  //   $(this).next('textarea').val($(this).text()).focus();
  //   var background = $(this).parent().css('background-color');
  //   $(this).next('textarea').css('background-color', background);
  // }

  // function saveNoteTitle(){
  //   $(this).addClass('hidden');
  //   $(this).prev().removeClass('hidden');
  //   $(this).prev().text($(this).val());
  // }
  //
  // function enterSaveNoteTitle(event){
  //   var keycode = (event.keyCode ? event.keyCode : event.which);
  //   if(keycode === 13){
  //     $(this).addClass('hidden');
  //     $(this).prev().removeClass('hidden');
  //     $(this).prev().text($(this).val());
  //   }
  // }


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



  /* RhymeBrain Below */

  function getRhymes(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://rhymebrain.com/talk?function=getRhymes&maxResults=20&word=${word}&jsonp=RhymeBrainResponse`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }


})();
