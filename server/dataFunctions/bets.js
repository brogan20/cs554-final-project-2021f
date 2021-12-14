const mongoCollections = require('../config/mongoCollections');
const bets = mongoCollections.betsCollection;
const {ObjectId} = require('mongodb');
const { betsCollection } = require('../config/mongoCollections');
const timePerBattle = 60000;//in milliseconds 

const removeAll = async function() {
	const betsCollection = await bets();
	betsCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked bets database"});
}

const createBet = async function(trainerOne, trainerTwo, pokemonOne, pokemonTwo, winner) {
	if(arguments.length != 5 || trainerOne == undefined || trainerTwo == undefined || pokemonOne == undefined || pokemonTwo == undefined || winner == undefined) {
		throw({code: 400, message: "createBet: you are missing one of trainerOne, trainerTwo, pokemonOne, pokemonTwo, winner"});
	}
	if(typeof trainerOne !== 'string' || trainerOne.trim() == "") {
		throw({code: 400, message: "createBet: trainerOne must be a string that isn't empty or just spaces"});
	}
    if(typeof trainerTwo !== 'string' || trainerTwo.trim() == "") {
		throw({code: 400, message: "createBet: trainerTwo must be a string that isn't empty or just spaces"});
	}
    if(typeof pokemonOne !== 'string' || pokemonOne.trim() == "") {
		throw({code: 400, message: "createBet: pokemonOne must be a string that isn't empty or just spaces"});
	}
    if(typeof pokemonTwo !== 'string' || pokemonTwo.trim() == "") {
		throw({code: 400, message: "createBet: pokemonTwo must be a string that isn't empty or just spaces"});
	}
    if(typeof winner !== 'string' || winner.trim() == "") {
		throw({code: 400, message: "createBet: winner must be a string that isn't empty or just spaces"});
	}
    if(winner != trainerOne && winner != trainerTwo) {
		throw({code: 400, message: "createBet: winner must be one of the two trainers"});
	}
	
	const betsCollection = await bets();
    const nowDate = new Date().getTime();
	
	let newBet = {
		trainerOne: trainerOne,
        trainerTwo: trainerTwo,
        pokemonOne: pokemonOne,
        pokemonTwo: pokemonTwo,
        winner: winner,
        timeStamp: (nowDate+timePerBattle)
	};
	
	const inIn = await betsCollection.insertOne(newBet);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "createBet: unable to add that bet"});
	}
	else{
        let ret = await this.get(inin.instertedID.toString());
		return ret;
	}
}


const getBet = async function(betID) {
	if(arguments.length != 1 || betID == undefined) {
		throw({code: 400, message: "getBet: you are missing a betID"});
	}
	else if (typeof betID === 'string') {
		betID = ObjectId(betID);
	}
	else {
		throw({code: 400, message: "getBet: betID must be a string'"});
	}

    if(betID instanceof ObjectId) {
        const betsCollection = await bets();

        const battle = await betsCollection.findOne({_id: betID});

        if(battle == null) {
            throw({code: 404, message: "getBet: a bet with that ID does not exist"});
        }
        else{
            const nowDate = new Date().getTime();
            if(nowDate < battle.timeStamp){
                let timeToWait = battle.timeStamp - nowDate;
                timeToWait = timeToWait / 1000;
                return({code: 400, message: "You cannot access this battle's results yet, please check again later", timeTillResult: timeToWait});
            }
            else{
                return battle;
            }
        }
    }
    else {
        throw({code: 400, message: "getBet: betID must be a valid ObjectID'"});
    }
}

module.exports = {
	removeAll,
    createBet,
    getBet
}