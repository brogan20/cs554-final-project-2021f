const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/battles');

async function main(){
	try {
		await popularityData.initPopularity();
        
        await userData.createUser("Red");
        await userData.addPokemon("25", "pikachu", "blankURL", true, "Red");
        await userData.addPokemon("25", "pikachu", "blankURL", false, "Red");
        await userData.addPokemon("132", "ditto", "blankURL", false, "Red");
        await userData.addPokemon("25", "pikachu", "blankURL", false, "Red");
        await userData.changeFunds("Red", 50);
        
        await userData.createUser("Dawn");
        await userData.addPokemon("393", "piplup", "blankURL", false, "Dawn");
        
        await userData.createUser("James");
        await userData.addPokemon("387", "turtwig", "blankURL", false, "James");
        await userData.addPokemon("196", "crobat", "blankURL", false, "James");

        let battleOneID = await battleData.createBet("Red", "Dawn", "pikachu", "piplup");

        await popularityData.changePokemonPopularity("piplup", 1000);

        let battleTwoID = await battleData.createBet("Red", "Dawn", "pikachu", "piplup");

		console.log("database has been populated");
	}catch(e){
		console.log(e);
	}
	process.exit();
};

main().catch((error) => {
  console.log(error);
});