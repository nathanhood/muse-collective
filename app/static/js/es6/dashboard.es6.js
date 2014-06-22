/* jshint unused:false */

'use strict';

(function(){

  $(document).ready(init);

  function init(){
    // $('#submit-create-project').click(createProject);
  }

  // function createProject(event){
  //   var form = $('#create-project').serializeArray();
  //   var projObj = {};
  //   form.map((obj, i)=>{projObj[form[i].name] = form[i].value;});
  //   if(projObj.title === ''){
  //     projObj.title = 'Untitled';
  //   }
  //
  //   ajax('/projects/create', 'POST', projObj, jsonObj=>{
  //     jsonObj = $.parseJSON(jsonObj);
  //     if(jsonObj.status === 'brainstorming'){
  //       ajax('/boards/create', 'POST', jsonObj, boardObj=>{
  //         boardObj = $.parseJSON(boardObj);
  //         res.render(`/boards/${boardObj._id}`);
  //         // window.location('/boards/' + boardObj._id);
  //       });
  //     }else if(jsonObj.status === 'drafting'){
  //       window.location(`/projects/${jsongObj._id}/draft`);
  //     }
  //   });
  //   event.preventDefault();
  // }
  //
  // function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
  //   $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
  // }

})();
