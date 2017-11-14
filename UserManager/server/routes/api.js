const express = require('express');
const router = express.Router();

var User = require('../repositories/UserRepository');

/* GET api listing. */
router
    .get('/', (req, res) => {
        res.json({status:"ok"});
    })

    .get('/create_test_user', (req, res) => {
        var params = { newObj : {
                email: Math.floor(Math.random() * (9999 - 1000) + 1000) + "@test.fakemail",
                password: "test",
                status: 0
            }
        };
        User.create(params, function(err, response){
            if(err) {
                return res.status(err.code).json(err.message);
            } else {
                return res.json(response);
            }
        })
    })
    
    .get('/login', (req, res) => {
        if(req.session.email != null) {
            // already logged in
            return res.json({logged: true, err: "already logged"});
        }
        var email = req.query.email;
        var password = req.query.password; // TODO password needs to be hashed and salted
        if(email != null && password != null) {
            User.findByEmail({email: email}, function(err, response){
                if(err) return res.json({logged: false, err: "invalid email"});
                if(password == response.password) {
                    req.session.email = email;
                    return res.json({logged: true, err: null});
                }
                else return res.json({logged: false, err: "invalid password"});
            });
        }
        else return res.json({logged: false, err: "email or password empty"});
    })

    .get('/logout', (req, res) => {
        // already logged in
        req.session.email = null;
        return res.json({logged: false, err: null}); 
    });

module.exports = router;