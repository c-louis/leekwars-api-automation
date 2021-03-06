const expect    	= require("chai").expect;
const { assert } 	= require('chai');
const leekapi 		= require('../index');
var fights			= [];

describe("Login test", function() {
	this.timeout(60000);
	var leek_login = process.env.npm_config_leek_login;
	var leek_password = process.env.npm_config_leek_password;

	it("Sucessfully login", async () => {
		return leekapi.login(leek_login, leek_password).then((res) => {
			expect(res).to.equal(true);
		}).catch((err) => {
			console.error(err);
		});
	});
	it("Failed login", async () => {
		return leekapi.login("rand", "rand").then((res) => {
			expect(res).to.equal(true);
		}).catch((err) => {
			assert.isDefined(err);
		}).then(() => {
		});
	});
});

describe("Leeks list", function() {
	it("test leeks list", async function() {
		var res = leekapi.getLeeks();
		

		expect(typeof res).to.equal("object");
	});
});

describe("Opponent", function() {
	this.timeout(60000);
	it("leek opponents", async function() {
		var leeks = leekapi.getLeeks();
		let leekId = Object.keys(leeks)[0];
		return leekapi.leekOpponents(leekId).then((res) => {
			expect(res['opponents'].length).to.equal(5);
		}).catch((err) => {
			console.log(err);
		});
	});
	it("farmer opponents", async function() {
		return leekapi.farmerOpponents().then((res) => {
			expect(res['opponents'].length).to.equal(5);
		}).catch((err) => {
			console.log(err);
		});
	});
});

describe("Fight", function() {
	this.timeout(60000);
	it("leek fight", async function() {
		var leeks = leekapi.getLeeks();
		let leekId = Object.keys(leeks)[0];
		var opponents = await leekapi.leekOpponents(leekId);
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.leekFight(leekId, opponentId).then((res) => {
			assert.isDefined(res['fight']);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
		
	});
	it("farmer fight", async function() {
		var opponents = await leekapi.farmerOpponents();
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.farmerFight(opponentId).then((res) => {
			assert.isDefined(res['fight']);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
	});	
});

describe("With Middle Api Fight", function() {
	this.timeout(60000);
	it("leek fight", async function() {
		var leeks = leekapi.getLeeks();
		let leekId = Object.keys(leeks)[0];
		var opponents = await leekapi.leekOpponents(leekId);
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.leekFight(leekId, opponentId, true).then((res) => {
			assert.isDefined(res['fight']);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
		
	});
	it("farmer fight", async function() {
		var opponents = await leekapi.farmerOpponents();
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.farmerFight(opponentId, true).then((res) => {
			assert.isDefined(res['fight']);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
	});	
});

describe("Challenge", function() {
	this.timeout(60000);
	it("leek fight", async function() {
		var leeks = leekapi.getLeeks();
		let leekId = Object.keys(leeks)[0];
		var opponents = await leekapi.leekOpponents(leekId);
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.leekChallenge(leekId, opponentId).then((res) => {
			assert.isDefined(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
		
	});
	it("farmer fight", async function() {
		var opponents = await leekapi.farmerOpponents();
		let opponentId = opponents['opponents'][0]['id'];

		return leekapi.farmerChallenge(opponentId).then((res) => {
			assert.isDefined(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
	});	
});

describe("Getting Fights", function() {
	this.timeout(60000);
	it("get fights", async function() {
		for (var fight of fights) {
			let data = leekapi.getFight(fight).then((res) => {
				assert.isDefined(res['id']);
				assert.isDefined(res['date']);
			}).catch((err) => {
				console.log(err);
			});
			await data;
		}
	});
});

describe("Getting Fights Results", function() {
	this.timeout(120000);
	it("get fights", async function() {
		var opponents = await leekapi.farmerOpponents();
		let opponentId = opponents['opponents'][0]['id'];

		let fight = await leekapi.farmerFight(opponentId);
		let data = leekapi.getFightResult(fight['fight']).then((res) => {
			assert.isDefined(res['report']);
			expect(res['report']).not.equal(null);
		}).catch((err) => {
			console.log(err);
		});
		await data;
	});
});

describe("Batch Fights", function() {
	this.timeout(60000);
	it("leek fights fast", async function() {
		var leeks = leekapi.getLeeks();
		let leekId = Object.keys(leeks)[0];
		
		return leekapi.leekBatchFights(leekId, 5, false, true).then((res) => {
			expect(res.length).to.equal(5);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
		
	});
	it("farmer fights fast", async function() {
		return leekapi.farmerBatchFights(5, false, true).then((res) => {
			expect(res.length).to.equal(5);
			fights.push(res['fight']);
		}).catch((err) => {
			console.log(err);
		});
	});
});