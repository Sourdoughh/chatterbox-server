var app = {
  rooms: [],
  server: 'http://localhost:3000/classes/messages'
};

$(document).ready(function(){

  app.init = function(){
    // listeners

    // populate room drop down with ALL possible rooms

    $('.refresh-button').on('click', function(){
      var roomselected = $('#roomSelect option:selected').val();
      app.fetch(roomselected);

    });

    $('.add-message-button').on('click', function(){
      var msg = $('.add-message-input').val();
      app.addMessage(msg);
    });

    $('.add-room-button').on('click', function(){
      var room = $('.add-room-input').val();
      app.addRoom(room);
      app.fetch(room);
    });

    $('#roomSelect').change(function(){
     var roomselected = $('#roomSelect option:selected').val();
     app.fetch(roomselected);
    });

    app.constructRoomDropdown();
    app.fetch();
  };

  app.addMessage = function(message) {
    // will eventually need to really add it
    // including room name

   var roomselected = $('#roomSelect option:selected').val();

    var msgObj = {
      'username': 'Spammer',
      'text': message,
      'roomname': roomselected
     };
    app.send(msgObj);

    var newChat = $('<div class="chat"></div>').text(msgObj.username + ': ' + message);

    $('#chats').prepend(newChat);
  };

  app.addRoom = function(room){ // does not go through a dup check
    var $roomOption = $('<option></option>');

    room = app.cleanString(room);

    $roomOption.text(room).attr('value', room);

    $('#roomSelect').prepend($roomOption);

    // change currently selected room?
    app.fetch(room);
  };

  app.send = function(message){
    //will make an ajax post to the server
    $.ajax({
      // always use this url
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  app.fetch = function(where){
    app.clearMessages();

    var dataObj = {
        order: '-createdAt',
        limit: 100,
    };

    if (where) {
      dataObj.where = '{"roomname":"' + where + '"}';
    };

    $.ajax({
      // always use this url
      url: app.server,
      // data: dataObj,
      type: 'GET',
      success: function(data){
        app.constructChats(data);
      },
      error: function () {
        console.error('chatterbox: Failed to get messages');
      }
    });
  };

  app.constructChats = function(data){
    // console.log(data);
    for(var i = 0; i < data.results.length; i++){
      if ( data.results[i].username !== undefined ||
           data.results[i].text !== undefined ) {

        var username = data.results[i].username;
        var text = data.results[i].text;
        var room = data.results[i].roomname;
        // var timeStamp = data.results[i].createdAt;
        var $chat = $('<div class="chat"></div>').text(username + ': ' + text + ' ' + room);

        // username = app.cleanString(username);
        // text = app.cleanString(text);
        // room = app.cleanString(room);

        $('#chats').prepend($chat);
      }
    }
  };

  app.constructRoomDropdown = function(){
    var dataObj = {
        keys: 'roomname',
        limit: 500
    };

    $.ajax({
      url: app.server,
      data: dataObj,
      type: 'GET',
      success: function(data){
        console.log(data)
        app.constructRooms(data);
      },
      error: function () {
        console.error('chatterbox: Failed to get messages');
      }
    });
  };

  app.constructRooms = function(data){
    for(var i = 0; i < data.results.length; i++){
      var room = data.results[i].roomname;
      if( app.rooms.indexOf(room) === -1 && room ) {
        app.rooms.push(room);
        app.addRoom(room);
      }
    }
  };

  app.cleanString = function(string) {
    return string.replace( /[\|&;\$%@"<>\(\)\+,'\!\=\{\}\[\]]/g, "" );
  };

  app.clearMessages = function() {
    $('#chats').empty();
  };


  app.addFriend = function(){

  };

  app.handleSubmit = function(){

  };

// USER NAME SELECTION
// check current URL for a username?
// input box to input/change username (show current username?)
// button
// event handler
//
  // select username fn?
  // where is the username coming from?
  // add a clickable username...



app.init();


/*
- could store first chat element we prepend, and use
  that unique id to inform our next fetch?

- start with messages on screen vs waiting 5 seconds

- select username

- sub select by room? (display only in-room msgs)
  ??? HOW do we use REST to filter our GET request results
      by room?
  ??? HOW do we add multiple filters onto our URL (like
      using ampersands to add on encodes)

- keep track of friends

 */
});
