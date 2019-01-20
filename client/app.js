//CLIENT
function fetchImage(url, user) {
    $.ajax({
        method: 'GET',
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            const imageUrl = response[0].url;
            $("#chat-window").append(`<div class="card card-body bg-light"><span class="font-weight-bold">${user}</span><img src=${imageUrl} width='200px' height='200px'></div>`)
        },
        fail: function (err) {
            console.log(err);
        }
    })
}
const socket = io();
socket.on('connect', function () {
    console.log('connected to server from client');
});
socket.on('disconnect', function () {
    console.log('disconnected from server');
});
socket.on('welcomeMessage', function (message) {
    $("#chat-window").append(`<div class="card card-body bg-light"><span class="font-weight-bold">${message.user}</span>  ${message.content}</div>`);
});
socket.on('newMessage', function (message) {
    if (message.content === '!cat') {
        console.log(message.content);
        fetchImage('https://api.thecatapi.com/v1/images/search?size=full', 'Admin')
    }
    $("#chat-window").append(`<div class="card card-body bg-light"><span class="font-weight-bold">${message.user}</span>  ${message.content}</div>`);
});
socket.on('displayTime', function (timeString) {
    $("#chat-window").append(`<div class="card card-body bg-light">${timeString}</div>`);
});
$("#username-form").on("submit", function (e) {
    e.preventDefault();
    var username = $("#username-input").val().trim();
    if (!username) {
        $("#username-input").addClass('red');
        $("#username-form").prepend('<div class="alert alert-danger" role="alert">Please enter username</div>');
        $(".alert-danger").delay(2000).fadeOut();
        return false;
    }
    socket.emit("newUser", username);
    $("#username-form").hide();
    $("#chatbot-content").show();
    $("#send").on("click", function (e) {
        e.preventDefault();
        var content = $("#msg-content").val().trim();
        socket.emit("createMessage", {
            user: username,
            content: content
        });
        $("#msg-content").val('');
    });
});

socket.on('fetchUser', function (users) {
    $("#active-users").html(`There are ${users.length} active users`);
    users.forEach((user) => {
        $("#active-users").append(`<div class="card card-body bg-light">${user}</div>`);
    });
});

socket.emit('loadMessages');
//load messages from db
socket.on('fetchMessage', (messages) => {
    // console.log(messages);
    messages.forEach((message) => {
        $("#chat-window").append(`<div class="card card-body bg-light"><span class="font-weight-bold">${message.user}</span>  ${message.content}</div>`);
    });
});
