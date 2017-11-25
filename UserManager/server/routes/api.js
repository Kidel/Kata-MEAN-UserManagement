const express = require('express');
const router = express.Router();

var User = require('../repositories/UserRepository');

var sha256 = require('sha256');

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

/* GET api listing. */
router
    .get('/', (req, res) => {
        res.json({ api_status:"ok" });
    })

    .get('/list', (req, res) => {
        User.list(function(err, response){
            if(err) {
                return res.status(err.code).json(err.message);
            } else {
                return res.json(response);
            }
        })
    })

    .get('/create_test_user', (req, res) => {
        var salt = sha256("" + getRandomArbitrary(1, 10000000000000000));
        var params = { newObj : {
                email: getRandomArbitrary(10000, 99999) + "@test.fakemail",
                salt: salt,
                password: sha256(salt+"test"),
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
    
    .post('/login', (req, res) => {
        if(req.session.email != null) {
            // already logged in
            res.json({logged: true, email: req.session.email, err: "already logged"});
        }
        var email = req.body.email;
        var password = req.body.password;
        if(email != null && password != null) {
            User.findByEmail({email: email}, function(err, response){
                if(err) return res.json({logged: false, err: "invalid email"});
                if(sha256(response.salt+password) == response.password) {
                    req.session.email = email;
                    return res.json({logged: true, email: email, err: null});
                }
                else return res.json({logged: false, err: "invalid password"});
            });
        }
        else return res.json({logged: false, err: "email or password empty"});
    })

    .post('/logout', (req, res) => {
        // already logged in
        req.session.email = null;
        return res.json({logged: false, err: null}); 
    })

    .get('/logged', (req, res) => {
        if(req.session.email != null)
            return res.json({logged: true, email: req.session.email, err: null});
        else return res.json({logged: false,  err: null});
    })

    .post('/updateStatus', (req, res) => {
        if(req.session.email == null) {
            return res.json({status:false, err: "not logged"});
        }
        var email = req.session.email;
        var status = req.body.status;

        User.update({email: email, modifiedObj: { status: status, last_action: Date.now() }}, function(err, response){
            if(err) { console.log(err); return res.json({status: "err", err: "error with the database"}); }
            else return res.json({status: "ok", err: null});
        });
    })

module.exports = router;