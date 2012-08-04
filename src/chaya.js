$(function () {
    "use strict";

    window.setInterval(updateTime, 60000);

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };

    var debug = false;

    if (debug) {
        connect('benjamin');
    }

    var messageTemplate = _.template(
        '<div class="box">\n    <div class="pic"></div>\n    <div class="msg">\n        <div class="meta">\n            <div class="from">{{nickname}}</div>\n            <div class="time" data-timestamp="{{timestamp}}"></div>\n        </div>\n        <div class="content">{{message}}</div>\n    </div>\n</div>'
    );


    function appendMessage(data) {
        var $entry = $(messageTemplate(data));
        $('#content').append($entry);
        scrollDown();
        updateTime();
    }

    function updateTime() {
        $('.time').each(function() {
            var $this = $(this);
            var timestamp = $this.data('timestamp');
            var fromNow = moment(timestamp).fromNow();
            $this.text(fromNow);
        });
    }

    function scrollDown() {
        $('html, body').prop('scrollTop', $(document).height());
    }

    $('#nickname input')
        .focus()
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                var nickname = $(this).val();
                if (nickname) {
                    connect(nickname);
                }
            }
        });

    function connect(nickname) {
        var socket = io.connect('/');

        socket.emit('whoami', nickname);

        socket.on('poke', appendMessage);

        if (debug) {
            socket.emit('peek', 'was geht ab?');
        }

//        socket.on('meta', function (data) {
//            $('#content').append($('<div class="entry meta">' + data.message + '</div>'));
//        });

        $('#nickname').hide();
        $('#chat').show();

        $('#south input')
            .focus()
            .on('keyup', function (ev) {
                if (ev.keyCode === 13) {
                    var message = $(this).val();
                    if (message) {
                        socket.emit('peek', message);
                        $(this).val('');
                    }
                }
            });



    }
});