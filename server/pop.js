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
        
        await userData.createUser("Red", "gidRed");
        await userData.addPokemon("25", "pikachu", "blankURL", false, "gidRed");
        await userData.addPokemon("132", "ditto", "blankURL", false, "gidRed");
        await userData.changeFunds("gidRed", 50);
        
        await userData.createUser("Dawn", "gidDawn");
        await userData.addPokemon("393", "piplup", "blankURL", false, "gidDawn");
        
        await userData.createUser("James", "gidJames");
        await userData.addPokemon("387", "turtwig", "blankURL", false, "gidJames");
        await userData.addPokemon("196", "crobat", "blankURL", true, "gidJames");
        await userData.changeFunds("gidJames", 50);

        let battleOne = await battleData.createBattle("Red", "Dawn", pikachuData, piplupData);
        let battleTwo = await battleData.createBattle("Red", "James", dittoData, crobatData);

        await battleData.createBet("gidJames", 25, battleOne._id, "Red");

		console.log("database has been populated");
	}catch(e){
		console.log(e);
	}
	process.exit();
};

main().catch((error) => {
  console.log(error);
});