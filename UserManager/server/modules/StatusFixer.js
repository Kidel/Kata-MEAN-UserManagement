var User = require('../repositories/UserRepository');
var config = require("../../config");

module.exports = {
    fix: function(){
        console.log("Logout set to users with last action older than "+config.logoutTime+" seconds.");
        User.list(function(error_code, users){
            if(error_code==0){
                for(var i = 0; i < users.length; i++){
                    if(((Date.now() - users[i].last_action.getTime()) / (1000 * config.logoutTime)) > 1){
                        User.update({email: users[i].email, modifiedObj: { status: 0, last_action: Date.now() }}, function(err, response){
                            if(err) console.log(err); 
                        });
                    }
                }
            }
        })
    }
}