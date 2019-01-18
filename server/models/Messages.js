const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new mongoose.Schema({
    user: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
});

const Messages = mongoose.model('Messages',MessageSchema);
module.exports = Messages;