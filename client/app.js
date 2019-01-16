//CLIENT

const socket = io();
socket.on('connect', function () {
    console.log('connected to server from client');

});
socket.on('disconnect', function () {
    console.log('disconnected from server');
});
socket.on('newMessage', function (message) {
    console.log('New message!', message);
    $("#chat-window").append(`<div class="card card-body bg-light"><span class="font-weight-bold">${message.user}</span>  ${message.content}</div>`)
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

socket.on('fetchUser',function(users){
    $("#active-users").html(`There are ${users.length} active users`);
    users.forEach((user) => {
        $("#active-users").append(`<div class="card card-body bg-light">${user}</div>`);
    });
});

