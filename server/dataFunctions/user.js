const mongoCollections = require('./config/mongoCollections');
const users = mongoCollections.usersCollection;
const {ObjectId} = require('mongodb');
const { usersCollection } = require('../config/mongoCollections');

const removeAll = async function() {
	const usersCollection = await users();
	usersCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked database"});
}

const createUser = async function(userName) {
	if(arguments.length != 1 || userName == undefined) {
		throw({code: 400, message: "createUser: you are missing userName"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "createUser: userName must be a string that isn't empty or just spaces"});
	}
	
	const usersCollection = await users();
	
	const nameExist = await usersCollection.findOne({userName: userName});
	if(nameExist != null) {
		throw({code: 400, message: "createUser: a user with that display name already exists"});
	}
	
	let newUser = {
		userName: userName,
        cardCollection: [],
        wallet: 0
	};
	
	const inIn = await usersCollection.insertOne(newUser);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "createUser: unable to add that user"});
	}
	else{
		return({code: 200, message: "createUser: New user successfully added"});
	}
}

const getUser = async function(userName){
    if(arguments.length != 1 || userName == undefined) {
		throw({code: 400, message: "getUser: you are missing userName"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "getUser: userName must be a string that isn't empty or just spaces"});
	}

	const usersCollection = await users();

	const user = await usersCollection.findOne({userName: userName});

	if(user == null) {
		throw({code: 400, message: "getUser: a user with that display name does not exist"});
	}
    
	return user;
}

module.exports = {
	removeAll,
	createUser,
	getUser
}