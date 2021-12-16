const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/battles');

const dittoData = {
    pokemonID: 132,
    pokemonName: "ditto",
    imageLink: "blankURL",
    isShiny: false
}
const pikachuData = {
    pokemonID: 25,
    pokemonName: "pikachu",
    imageLink: "blankURL",
    isShiny: false
}
const piplupData = {
    pokemonID: 393,
    pokemonName: "piplup",
    imageLink: "blankURL",
    isShiny: false
}
const turtwigData = {
    pokemonID: 387,
    pokemonName: "turtwig",
    imageLink: "blankURL",
    isShiny: false
}
const crobatData = {
    pokemonID: 196,
    pokemonName: "crobat",
    imageLink: "blankURL",
    isShiny: true
}

async function main(){
	try {
		await popularityData.initPopularity();
        
        await userData.createUser("Red");
        await userData.addPokemon("25", "pikachu", "blankURL", false, "Red");
        await userData.addPokemon("132", "ditto", "blankURL", false, "Red");
        await userData.changeFunds("Red", 50);
        
        await userData.createUser("Dawn");
        await userData.addPokemon("393", "piplup", "blankURL", false, "Dawn");
        
        await userData.createUser("James");
        await userData.addPokemon("387", "turtwig", "blankURL", false, "James");
        await userData.addPokemon("196", "crobat", "blankURL", true, "James");
        await userData.changeFunds("James", 50);

        let battleOne = await battleData.createBattle("Red", "Dawn", pikachuData, piplupData);
        let battleTwo = await battleData.createBattle("Red", "James", dittoData, crobatData);

        await battleData.createBet("James", 25, battleOne._id, "Red");

		console.log("database has been populated");
	}catch(e){
		console.log(e);
	}
	process.exit();
};

main().catch((error) => {
  console.log(error);
});