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
		throw({code: 404, message: "getUser: a user with that display name does not exist"});
	}
    else{
		return user;
	}
}

const addCard = async function(cardName, isHolo, userName){
	if(arguments.length != 3 || cardName == undefined || isHolo == undefined || userName == undefined) {
		throw({code: 400, message: "addCard: you are missing cardName, isHolo, or userName"});
	}
	if(typeof cardName !== 'string' || cardName.trim() == "") {
		throw({code: 400, message: "addCard: cardName must be a string that isn't empty or just spaces"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "addCard: userName must be a string that isn't empty or just spaces"});
	}
	if(typeof isHolo !== 'boolean') {
		throw({code: 400, message: "addCard: isHolo must be a boolean"});
	}

	const usersCollection = await users();

	const user = await usersCollection.findOne({userName: userName});

	if(user == null) {
		throw({code: 404, message: "addCard: a user with that display name does not exist"});
	}

	newCard = {
		cardName: cardName,
		isHolo: isHolo
	};

	const upin = await usersCollection.updateOne({userName: userName}, {$push: {cardCollection: { newCard }}});
	if (upin === 0) {
		throw({code: 500, message: "addCard: unable to add that card to the database"});
	}
	else{
		return({code: 200, message: "addCard: card successfully added"});
	} 
}

const addFunds = async function(userName, toAdd){
	if(arguments.length != 2 || toAdd == undefined || userName == undefined) {
		throw({code: 400, message: "addFunds: you are missing toAdd or userName"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "addFunds: userName must be a string that isn't empty or just spaces"});
	}
	if(typeof toAdd !== 'number' || toAdd < 1) {
		throw({code: 400, message: "addFunds: toAdd must be a number greater than 0"});
	}

	const usersCollection = await users();

	const user = await usersCollection.findOne({userName: userName});

	if(user == null) {
		throw({code: 404, message: "addFunds: a user with that display name does not exist"});
	}

	let newBalance = user.wallet + toAdd;

	const upin = await usersCollection.updateOne({userName: userName}, {$set: {wallet: newBalance}});
	if (upin === 0) {
		throw({code: 500, message: "addFunds: unable to add to the wallet"});
	}
	else{
		return({code: 200, message: "addFunds: funds successfully added"});
	} 
}

module.exports = {
	removeAll,
	createUser,
	getUser,
	addCard,
	addFunds
}