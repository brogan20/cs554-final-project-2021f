const mongoCollections = require('../config/mongoCollections');
const battles = mongoCollections.battleCollection;
const users = mongoCollections.usersCollection;
const {ObjectId} = require('mongodb');
const { battleCollection } = require('../config/mongoCollections');
const { usersCollection } = require('../config/mongoCollections');
const popularityData = require('./popularity');
const userData = require('./user');
const timePerBattle = 60000;//in milliseconds 

const removeAll = async function() {
	const battleCollection = await battles();
	await battleCollection.deleteMany({ });
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
    if(typeof pokemonOne.pokemonName !== 'string' || pokemonOne.pokemonName.trim() == "") {
		throw({code: 400, message: "createBattle: pokemonOne's name must be a string that isn't empty or just spaces"});
	}
    if(typeof pokemonTwo.pokemonName !== 'string' || pokemonTwo.pokemonName.trim() == "") {
		throw({code: 400, message: "createBattle: pokemonTwo's name must be a string that isn't empty or just spaces"});
	}

    pokemonOne.pokemonName = pokemonOne.pokemonName.toLowerCase();
    pokemonTwo.pokemonName = pokemonTwo.pokemonName.toLowerCase();

    let winner = trainerOne;
    let pokemonOnePop = await popularityData.getPokemonPopularity(pokemonOne.pokemonName);
    let pokemonTwoPop = await popularityData.getPokemonPopularity(pokemonTwo.pokemonName);
    if(pokemonOnePop > pokemonTwoPop) {
        let ourOdds = pokemonOnePop/(pokemonOnePop + pokemonTwoPop);
        if(Math.random <= ourOdds) {winner = trainerOne}
        else {winner = trainerTwo}
    }
    else {
        let ourOdds = pokemonTwoPop/(pokemonOnePop + pokemonTwoPop);
        if(Math.random <= ourOdds) {winner = trainerTwo}
        else {winner = trainerOne}
    }
	
    if(winner == trainerTwo) {
        await popularityData.changePokemonScore(pokemonOne.pokemonName, false);
        await popularityData.changePokemonScore(pokemonTwo.pokemonName, true);
    }
    else {
        await popularityData.changePokemonScore(pokemonOne.pokemonName, true);
        await popularityData.changePokemonScore(pokemonTwo.pokemonName, false);
    }

	const battleCollection = await battles();
    const nowDate = new Date().getTime();
	
	let newBattle = {
		trainerOne: trainerOne,
        trainerTwo: trainerTwo,
        pokemonOne: pokemonOne,
        pokemonTwo: pokemonTwo,
        winner: winner, 
        battleBets: [],
        payoutGiven: false,
        timeStamp: (nowDate+timePerBattle)
	};
	
	const inIn = await battleCollection.insertOne(newBattle);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "createBattle: unable to add that battle"});
	}
	else{
        let newBattleID = await inIn.insertedId.toString();
        newBattle._id = newBattleID;
        newBattle.winner = winner;
		return newBattle;
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
            if(nowDate <= battle.timeStamp){
                battle.winner = "";
            }
            battle._id = battle._id.toString();
            return battle;
        }
    }
    else {
        throw({code: 400, message: "getBattle: battleID must be a valid ObjectID'"});
    }
}

const getCurrentBattles = async function() {
    const battleCollection = await battles();
    const nowDate = new Date().getTime();
    const ongoing = await battleCollection.find({timeStamp: {$gt: nowDate} }).toArray();

    ongoing.forEach(element => {
        element._id = element._id.toString();
    });

    return ongoing;
}

const createBet = async function(gid, betAmount, battleID, predectedWinner) {
	if(arguments.length != 4 || battleID == undefined || gid == undefined || betAmount == undefined || predectedWinner == undefined) {
		throw({code: 400, message: "createBet: you are missing one of gid, betAmount, predectedWinner, or battleID"});
	}
    if(typeof gid !== 'string' || gid.trim() == "") {
		throw({code: 400, message: "createBet: gid must be a string that isn't empty or just spaces"});
	}
    if(typeof predectedWinner !== 'string' || predectedWinner.trim() == "") {
		throw({code: 400, message: "createBet: predectedWinner must be a string that isn't empty or just spaces"});
	}
	if(typeof betAmount !== 'number' || betAmount == 0) {
		throw({code: 400, message: "createBet: betAmount must be a number that isn't zero"});
	}
	else if (typeof battleID === 'string') {
		battleID = ObjectId(battleID);
	}
	else {
		throw({code: 400, message: "createBet: battleID must be a string'"});
	}

    if(battleID instanceof ObjectId) {
        const usersCollection = await users();
        const user = await usersCollection.findOne({gid: gid});
        if(user == null) {
            throw({code: 404, message: "createBet: a user with that display name does not exist"});
        }
        const battleCollection = await battles();
        const battle = await battleCollection.findOne({_id: battleID});
        if(battle == null) {
            throw({code: 404, message: "createBet: a battle with that ID does not exist"});
        }
        if(user.wallet < betAmount) {
            betAmount = user.wallet;
        }
        let pokemonOnePop = await popularityData.getPokemonPopularity(battle.pokemonOne.pokemonName);
        let pokemonTwoPop = await popularityData.getPokemonPopularity(battle.pokemonTwo.pokemonName);    
        let ourPayout = 0;
        if(predectedWinner == battle.trainerOne) {
            ourPayout += (betAmount + (betAmount * (pokemonTwoPop/pokemonOnePop)));
        }
        else if(predectedWinner == battle.trainerTwo) {
            ourPayout += (betAmount + (betAmount * (pokemonOnePop/pokemonTwoPop)));
        }
        else {
            throw({code: 400, message: "createBet: predeictedWinner is neither of the two battle's trainers"});
        }

        ourPayout = Math.trunc(ourPayout);

        await userData.changeFunds(gid, (betAmount * -1))

        newBet = {
            gid: gid,
            predectedWinner: predectedWinner,
            payout: ourPayout
        }
        const upin = await battleCollection.updateOne({_id: battleID}, {$push: {battleBets: newBet }});
        if (upin === 0) {
            throw({code: 500, message: "createBet: unable to add that bet to the database"});
        }
        else{
            return newBet;
        } 
    }
    else {
        throw({code: 400, message: "createBet: battleID must be a valid ObjectID'"});
    }
}

const payoutAllBattles = async function() {
    const battleCollection = await battles();
    const nowDate = new Date().getTime();
    const ourBattles = await battleCollection.find({timeStamp: {$lt: nowDate} }).toArray();

    ourBattles.forEach(async element => {
        if(element.payoutGiven) {
            await battleCollection.deleteOne({_id: element._id});
        }
        else{
            element.battleBets.forEach(async subElement => {
                if(subElement.predectedWinner == element.winner) {
                    await userData.changeFunds(subElement.gid, subElement.payout)
                }
            });
            await battleCollection.updateOne({_id: element._id}, {$set: {payoutGiven: true}});
        }
    });

    return "Oh man this was dumb but i'm lowkey kinda proud of it";
}

module.exports = {
	removeAll,
    createBattle,
    getBattle,
    getCurrentBattles,
    createBet,
    payoutAllBattles
}