var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    'email' : {type: String, required: true, unique: true},
    'password': {type: String, required: true}, // TODO password needs to be hashed and salted
    'created' : { type : Date, default: Date.now },
    'status' : { type: Number } //0 = offline, 1 = idle, 2 = active. >=1 is online
});

module.exports = mongoose.model('User', UserSchema);