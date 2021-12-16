const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.usersCollection;
const {ObjectId} = require('mongodb');
const { usersCollection } = require('../config/mongoCollections');

const removeAll = async function() {
	const usersCollection = await users();
	usersCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked users database"});
}

//Add in a win loss record for each trainer???

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
		throw({code: 400, message: "createUser: a user with that username already exists"});
	}
	
	let newUser = {
		userName: userName,
        pokemonCollection: [],
        wallet: 0
	};
	
	const inIn = await usersCollection.insertOne(newUser);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "createUser: unable to add that user"});
	}
	else{
        let newUserID = await inIn.insertedId.toString();
        newUser._id = newUserID;
		return newUser;
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
		user._id = user._id.toString();
		return user;
	}
}

const addPokemon = async function(pokemonID, pokemonName, imageLink,  isShiny, userName){		//should I be passed pokemonName and imageLink? or would it be prefered I just get ID and I make a call for
	if(arguments.length != 5 || pokemonID == undefined || pokemonName == undefined || isShiny == undefined || userName == undefined || imageLink == undefined) {
		throw({code: 400, message: "addPokemon: you are missing pokemonID, pokemonName, imageLink, isShiny, or userName"});
	}
	if(typeof pokemonID !== 'string' || pokemonID.trim() == "") {
		throw({code: 400, message: "addPokemon: pokemonID must be a string that isn't empty or just spaces"});
	}
	if(typeof pokemonName !== 'string' || pokemonName.trim() == "") {
		throw({code: 400, message: "addPokemon: pokemonName must be a string that isn't empty or just spaces"});
	}
	if(typeof imageLink !== 'string' || imageLink.trim() == "") {
		throw({code: 400, message: "addPokemon: imageLink must be a string that isn't empty or just spaces"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "addPokemon: userName must be a string that isn't empty or just spaces"});
	}
	if(typeof isShiny !== 'boolean') {
		throw({code: 400, message: "addPokemon: isShiny must be a boolean"});
	}

	pokemonName = pokemonName.toLowerCase();

	const usersCollection = await users();

	const user = await usersCollection.findOne({userName: userName});

	if(user == null) {
		throw({code: 404, message: "addPokemon: a user with that display name does not exist"});
	}

	newPokemon = {
		pokemonID: pokemonID,
		pokemonName: pokemonName,
		imageLink: imageLink,
		isShiny: isShiny
	};

	const upin = await usersCollection.updateOne({userName: userName}, {$push: {pokemonCollection: newPokemon }});
	if (upin === 0) {
		throw({code: 500, message: "addPokemon: unable to add that pokemon to the database"});
	}
	else{
		return newPokemon;
	} 
}

const changeFunds = async function(userName, toChange){
	if(arguments.length != 2 || toChange == undefined || userName == undefined) {
		throw({code: 400, message: "addFunds: you are missing toAdd or userName"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "addFunds: userName must be a string that isn't empty or just spaces"});
	}
	if(typeof toChange !== 'number' || toChange == 0) {
		throw({code: 400, message: "addFunds: toChange must be a number that isn't zero"});
	}

	const usersCollection = await users();

	const user = await usersCollection.findOne({userName: userName});

	if(user == null) {
		throw({code: 404, message: "addFunds: a user with that display name does not exist"});
	}

	let newBalance = user.wallet + toChange;

	const upin = await usersCollection.updateOne({userName: userName}, {$set: {wallet: newBalance}});
	if (upin === 0) {
		throw({code: 500, message: "addFunds: unable to add to the wallet"});
	}
	else{
		return newBalance;
	} 
}

module.exports = {
	removeAll,
	createUser,
	getUser,
	addPokemon,
	changeFunds
}