const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/bets');

async function main(){
	try {
		await userData.removeAll();
		await popularityData.removeAll();
		await battleData.removeAll();
		console.log("database has been wiped");
	}catch(e){
		console.log(e);
	}
	process.exit();
};

main().catch((error) => {
  console.log(error);
});