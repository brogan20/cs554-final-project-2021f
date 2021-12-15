const mongoCollections = require('../config/mongoCollections');
const battles = mongoCollections.battleCollection;
const {ObjectId} = require('mongodb');
// const { battleCollection } = require('../config/mongoCollections');
const popularityData = require('./popularity');
const timePerBattle = 60000;//in milliseconds 

const removeAll = async function() {
	const battleCollection = await battles();
	battleCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked battles database"});
}

const createBattle = async function(trainerOne, trainerTwo, pokemonOne, pokemonTwo) {
	if(arguments.length != 4 || trainerOne == undefined || trainerTwo == undefined || pokemonOne == undefined || pokemonTwo == undefined) {
		throw({code: 400, message: "createBattle: you are missing one of trainerOne, trainerTwo, pokemonOne, pokemonTwo, winner"});
	}
	if(typeof trainerOne !== 'string' || trainerOne.trim() == "") {
		throw({code: 400, message: "createBattle: trainerOne must be a string that isn't empty or just spaces"});
	}
    if(typeof trainerTwo !== 'string' || trainerTwo.trim() == "") {
		throw({code: 400, message: "createBattle: trainerTwo must be a string that isn't empty or just spaces"});
	}
    if(typeof pokemonOne !== 'string' || pokemonOne.trim() == "") {
		throw({code: 400, message: "createBattle: pokemonOne must be a string that isn't empty or just spaces"});
	}
    if(typeof pokemonTwo !== 'string' || pokemonTwo.trim() == "") {
		throw({code: 400, message: "createBattle: pokemonTwo must be a string that isn't empty or just spaces"});
	}

    pokemonOne = pokemonOne.toLowerCase();
    pokemonTwo = pokemonTwo.toLowerCase();

    let winner = trainerOne;
    let pokemonOnePop = await popularityData.getPokemonPopularity(pokemonOne);
    let pokemonTwoPop = await popularityData.getPokemonPopularity(pokemonTwo);

    if(pokemonTwoPop > pokemonOnePop) {
        winner = trainerTwo;
    }
	
	const battleCollection = await battles();
    const nowDate = new Date().getTime();
	
	let newBattle = {
		trainerOne: trainerOne,
        trainerTwo: trainerTwo,
        pokemonOne: pokemonOne,
        pokemonTwo: pokemonTwo,
        winner: winner,
        timeStamp: (nowDate+timePerBattle)
	};
	
	const inIn = await battleCollection.insertOne(newBattle);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "createBattle: unable to add that battle"});
	}
	else{
        let ret = await inIn.insertedId.toString();
		return ret;
	}
}

const getBattle = async function(battleID) {
	if(arguments.length != 1 || battleID == undefined) {
		throw({code: 400, message: "getBattle: you are missing a battleID"});
	}
	else if (typeof battleID === 'string') {
		battleID = ObjectId(battleID);
	}
	else {
		throw({code: 400, message: "getBattle: battleID must be a string'"});
	}

    if(battleID instanceof ObjectId) {
        const battleCollection = await battles();

        const battle = await battleCollection.findOne({_id: battleID});

        if(battle == null) {
            throw({code: 404, message: "getBattle: a battle with that ID does not exist"});
        }
        else{
            const nowDate = new Date().getTime();
            if(nowDate < battle.timeStamp){
                let timeToWait = battle.timeStamp - nowDate;
                timeToWait = timeToWait / 1000;
                battle.winner = "To Be Determined";
                return({code: 200, battleInfo: battle, timeTillResult: timeToWait});
            }
            else{
                return({code: 200, battleInfo: battle, timeTillResult: 0});
            }
        }
    }
    else {
        throw({code: 400, message: "getBattle: battleID must be a valid ObjectID'"});
    }
}

module.exports = {
	removeAll,
    createBattle,
    getBattle
}