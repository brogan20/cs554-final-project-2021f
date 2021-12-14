const mongoCollections = require('./config/mongoCollections');
const popularity = mongoCollections.popularityCollection;
const {ObjectId} = require('mongodb');
const { popularityCollection } = require('../config/mongoCollections');

const removeAll = async function() {
	const popularityCollection = await users();
	popularityCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked popularity database"});
}

const initDatabase = async function() {
    const popularityCollection = await users();
}

module.exports = {
	removeAll
}