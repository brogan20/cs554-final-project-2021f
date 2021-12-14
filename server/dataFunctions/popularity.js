const mongoCollections = require('../config/mongoCollections');
const popularity = mongoCollections.popularityCollection;
const {ObjectId} = require('mongodb');
const { popularityCollection } = require('../config/mongoCollections');
const pokemonStartingValues = require('./pokemonData');

const removeAll = async function() {
	const popularityCollection = await popularity();
	popularityCollection.deleteMany({});
	return({code: 200, message: "removeAll: successfully nuked popularity database"});
}

const initDatabase = async function() {
    const popularityCollection = await popularity();
    const inIn = await popularityCollection.insertMany(pokemonStartingValues);

	if(inIn.insertCount === 0) {
		throw({code: 500, message: "initDatabase: unable to add starting data for pokemon"});
	}
	else{
		return({code: 200, message: "initDatabase: added all starting data for pokemon"});
	}
}

const getPokemonPopularity = async function(pokemonName) {
    if(arguments.length != 1 || pokemonName == undefined) {
		throw({code: 400, message: "getPokemonPopularity: you are missing pokemonName"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "getPokemonPopularity: pokemonName must be a string that isn't empty or just spaces"});
	}

    const popularityCollection = await popularity();

	const pokemon = await popularityCollection.findOne({pokeName: pokemonName});

	if(pokemon == null) {       //if the pokemon does not exist for us yet, I am creating it and starting it at a value of 500
        let newPokemon = {pokeName: pokemonName, pokePop: 500, pokeWins: 0, pokeLosses: 0};
        const inIn = await popularityCollection.insertOne(newPokemon);
        if(inIn.insertCount === 0) {
            throw({code: 500, message: "getPokemonPopularity: pokemon is not in database, and could not add it"});
        }
        else{
            return 500;
        }
	}
    else{
		return pokemon.pokePop;
	}
}

const changePokemonPopularity = async function(pokemonName, toChange) {
    if(arguments.length != 2 || pokemonName == undefined) {
		throw({code: 400, message: "changePokemonPopularity: you are missing pokemonName or toChange"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "changePokemonPopularity: pokemonName must be a string that isn't empty or just spaces"});
	}
    if(typeof toAdd !== 'number' || toAdd != 0) {
		throw({code: 400, message: "changePokemonPopularity: toChange must be a number an cannot be zero"});
	}

    let finalPop = toChange;

    const popularityCollection = await popularity();

	const pokemon = await popularityCollection.findOne({pokeName: pokemonName});

	if(pokemon == null) {       //if the pokemon does not exist for us yet, I am creating it and starting it at a value of 500
        if((500 + toChange) <= 0) {finalPop = 1;}
        else{finalPop += 500;}
        let newPokemon = {pokeName: pokemonName, pokePop: finalPop, pokeWins: 0, pokeLosses: 0};
        const inIn = await popularityCollection.insertOne(newPokemon);
        if(inIn.insertCount === 0) {
            throw({code: 500, message: "changePokemonPopularity: pokemon is not in database, and could not add it"});
        }
        else{
            return finalPop;
        }
	}
    else{
        if((pokemon.pokePop + toChange) <= 0) {finalPop = 1;}
        else{finalPop += pokemon.pokePop;}

        const upin = await popularityCollection.updateOne({pokeName: pokemonName}, {$set: {pokePop: finalPop}});

        if (upin === 0) {
            throw({code: 500, message: "changePokemonPopularity: failed to update"});
        }
        else{
            return finalPop;
        }
	}
}

const changePokemonScore = async function(pokemonName, didWin) {
    if(arguments.length != 2 || pokemonName == undefined) {
		throw({code: 400, message: "changePokemonScore: you are missing pokemonName or didWin"});
	}
	if(typeof userName !== 'string' || userName.trim() == "") {
		throw({code: 400, message: "changePokemonScore: pokemonName must be a string that isn't empty or just spaces"});
	}
    if(typeof didWin !== 'bool') {
		throw({code: 400, message: "changePokemonScore: didWin must be a boolean"});
	}

    const popularityCollection = await popularity();

	const pokemon = await popularityCollection.findOne({pokeName: pokemonName});

	if(pokemon == null) {       //if the pokemon does not exist for us yet, I am creating it and starting it at a value of 500
        let newPokemon;
        if(didWin) {
            newPokemon = {pokeName: pokemonName, pokePop: 500, pokeWins: 1, pokeLosses: 0};
        }
        else {
            newPokemon = {pokeName: pokemonName, pokePop: 500, pokeWins: 0, pokeLosses: 1};
        }
        const inIn = await popularityCollection.insertOne(newPokemon);
        if(inIn.insertCount === 0) {
            throw({code: 500, message: "changePokemonScore: pokemon is not in database, and could not add it"});
        }
        else{
            return didWin;
        }
	}
    else{
        let upin
        if(didWin) {
            upin = await popularityCollection.updateOne({pokeName: pokemonName}, {$set: {pokeWins: (pokemon.pokeWins + 1)}});
        }
        else {
            upin = await popularityCollection.updateOne({pokeName: pokemonName}, {$set: {pokeLosses: (pokemon.pokeLosses + 1)}});
        }
        if (upin === 0) {
            throw({code: 500, message: "changePokemonScore: failed to update"});
        }
        else{
            return didWin;
        }
	}
}

module.exports = {
	removeAll,
    initDatabase,
    getPokemonPopularity,
    changePokemonPopularity,
    changePokemonScore
}