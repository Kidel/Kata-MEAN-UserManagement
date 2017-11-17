var User = require('../repositories/UserRepository');

module.exports = {
    fix: function(){
        User.list(function(error_code, users){
            if(error_code==0){
                for(var i = 0; i < users.length; i++){
                    if(((Date.now() - users[i].last_action.getTime()) / (1000 * 3600)) > 1){
                        User.update({email: users[i].email, modifiedObj: { status: 0, last_action: Date.now() }}, function(err, response){
                            if(err) console.log(err); 
                        });
                    }
                }
            }
        })
    }
}