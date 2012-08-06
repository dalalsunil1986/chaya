$(function () {
    "use strict";

    window.setInterval(updateTimes, 60000);

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };

    var debug = false;

    if (debug) {
        connect('benjamin');
    }

    var messageTemplate = _.template('<div class="box">\n    <div class="pic"></div>\n    <div class="msg">\n        <div class="meta">\n            <div class="from">{{nickname}}</div>\n            <div class="time" data-timestamp="{{timestamp}}"></div>\n        </div>\n        <div class="content">{{message}}</div>\n    </div>\n</div>');
    var metaTemplate = _.template('<div class="info"><i class="icon-user"></i> {{nickname}} {{type}}</div>');


    function appendMessage(data) {
        var $entry = $(messageTemplate(data));
        var $time = $entry.find('.time');
        updateTime($time);
        $('#content').append($entry);
        scrollDown();
    }

    function appendMeta(data) {
        var $entry = $(metaTemplate(data));
        var $time = $entry.find('.time');
        updateTime($time);
        $('#content').append($entry);
        scrollDown();
    }

    function updateTimes() {
        $('.time').each(function() {
            updateTime($(this));
        });
    }

    function updateTime($time) {
        var timestamp = $time.data('timestamp');
        var fromNow = moment(timestamp).fromNow();
        $time.text(fromNow);
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

        socket.on('meta', appendMeta);

        if (debug) {
            socket.emit('peek', 'was geht ab?');
        }


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