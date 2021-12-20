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
		console.log("database has been populated");
        let dummyUser = await userData.createUser("Dummy", "dummyGID");
        let dummyPokemon = await userData.addPokemon("257", "blaziken", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png", true, dummyUser.gid);
        
	}catch(e){
		console.log(e);
	}
	process.exit();
};

main().catch((error) => {
  console.log(error);
});