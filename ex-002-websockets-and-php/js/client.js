var socket = io.connect();

var talkPirateLike = false;

socket.on('connect', function () {
    $('#chat').addClass('connected');
});

socket.on('announcement', function (msg) {
    $('#lines').append($('<p>').append($('<em>').text(msg)));
});

socket.on('nicknames', function (nicknames) {
    //$('#nicknames').empty().prepend($('<span>Online: <\/span>'));
    $('#pirate-room').empty().before($('<span>Online: <\/span>'));
    for (var i in nicknames) {
        $('#pirate-room').before($('<b>').text(nicknames[i]));
        //$('#nicknames').prepend($('<b>').text(nicknames[i]));
    }
    if (talkPirateLike === true) {
        $('#pirate-room').html('Human please');
    } else {
        $('#pirate-room').html("'Tis be pirated!");
    }
});

socket.on('user message', message);
socket.on('reconnect', function () {
    $('#lines').remove();
    message('System', 'Reconnected to the server');
});

socket.on('reconnecting', function () {
    message('System', 'Attempting to re-connect to the server');
});

socket.on('error', function (e) {
    message('System', e ? e : 'A unknown error occurred');
});

function message(from, msg) {
    // ... let's make an ajax call to our php stuff then.
    if (talkPirateLike === true) {
        msg = $.getJSON('/translate/pirate', {word: msg}, function(data) {
            if (data.success && data.success != '') { 
                $('#lines').append($('<p>').append($('<b>').text(from), data.success));
            } else {
                $('#lines').append($('<p>').append($('<b>').text(from), 'Pirate failed! Arg!!: ' + msg));
            }
        });

        return;
    }

    $('#lines').append($('<p>').append($('<b>').text(from), msg));
}

// dom manipulation
$(function () {
    $('#set-nickname').submit(function (ev) {
        socket.emit('nickname', $('#nick').val(), function (set) {
            if (!set) {
                clear();
                return $('#chat').addClass('nickname-set');
            }
            $('#nickname-err').css('visibility', 'visible');
            $('#pirate-room').css('visibility', 'visible');
            $('#pirate-room').css('display', 'block');

        });
        return false;
    });

    $('#send-message').submit(function () {
        message('me', $('#message').val());
        socket.emit('user message', $('#message').val());
        clear();
        $('#lines').get(0).scrollTop = 10000000;
        return false;
    });

    function clear() {
        $('#message').val('').focus();
    };
});


$('#pirate-room').live('click', function() {
    if (talkPirateLike === true) {
        $('#pirate-room').html("'Tis be pirated!");
        talkPirateLike = false;
        return;
    }

    $('#pirate-room').html("Human please");
    talkPirateLike = true;
});

$(document).ready(function() { $('#nick').focus(); });
