var UserModel = require('../models/UserModel');

/**
 * UserRepository.js
 *
 * @description :: Server-side logic for managing User.
 */
module.exports = {

	/**
	 * UserRepository.list()
     * @param {function} callback Function with two parameters, err and data
	 */
	list: function (callback) {
		UserModel.find(function (err, Users) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when getting User.',
					error: err
				}, null);
			} else {
				callback(0, Users); //200
			}
		});
	},

	/**
	 * UserRepository.show()
     * @param {json} params object with data
     * @param {function} callback Function with two parameters, err and data
	 */
	show: function (params, callback) {
		UserModel.findOne({_id: params.id}, function (err, User) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when getting User.',
					error: err
				}, null);
			} else {
				if (!User) {
					callback({
						code: 404,
						message: 'No such User'
					}, null);
				} else {
					callback(0, User); //200
				}
			}
		});
    },

	/**
	 * UserRepository.findByEmail()
     * Find a user by given email
     * @param {json} params object with data
     * @param {function} callback Function with two parameters, err and data
	 */
	findByEmail: function (params, callback) {
		UserModel.findOne({ email: params.email }, function (err, User) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when getting User.',
					error: err
				}, null);
			} else {
				if (!User) {
					callback({
						code: 404,
						message: 'No such User'
					}, null);
				} else {
					callback(0, User); //200
				}
			}
		});
	},

	/**
	 * UserRepository.create()
     * @param {json} params object with data
     * @param {function} callback Function with two parameters, err and data
	 */
	create: function (params, callback) {
		var User = new UserModel(params.newObj);

		User.save(function (err, User) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when creating User',
					error: err
				}, null);
			} else {
				callback(0, User); //201
			}
		});
	},

	/**
	 * UserRepository.update()
     * @param {json} params object with data {email:email, modifiedObj: {...}}
     * @param {function} callback Function with two parameters, err and data
	 */
	update: function (params, callback) {
		UserModel.findOne({email: params.email}, function (err, User) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when getting User',
					error: err
				}, null);
			} else {
				if (!User) {
					callback({
						code: 404,
						message: 'No such User'
					}, null);
				} else {
                    
                    User.email = params.modifiedObj.email ? params.modifiedObj.email : User.email;
                    User.password = params.modifiedObj.password ? params.modifiedObj.password : User.password; // TODO password needs to be hashed and salted
                    User.salt = params.modifiedObj.salt ? params.modifiedObj.salt : User.salt;
                    User.last_action = params.modifiedObj.last_action ? params.modifiedObj.last_action : User.last_action;
                    User.auth = params.modifiedObj.auth ? params.modifiedObj.auth : User.auth;
                    User.status = typeof(params.modifiedObj.status)!='undefined' ? params.modifiedObj.status : User.status;
                    			
					User.save(function (err, User) {
						if (err) {
							callback({
								code: 500,
								message: 'Error when updating User.',
								error: err
							}, null);
						} else {
							callback(0, User); //200
						}
					});
				}
			}
		});
	},

	/**
	 * UserRepository.remove()
     * @param {json} params object with data
     * @param {function} callback Function with two parameters, err and data
	 */
	remove: function (params, callback) {
		UserModel.findByIdAndRemove(params.id, function (err, User) {
			if (err) {
				callback({
					code: 500,
					message: 'Error when deleting the User.',
					error: err
				}, null);
			} else {
				callback(0, null); //204
			}
		});
	}
};