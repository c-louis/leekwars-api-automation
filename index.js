const baseURL = 'https://leekwars.com/api'
const middleURL = 'http://leekwarsapimiddle.eba-fypezsnv.eu-west-1.elasticbeanstalk.com/api.php'

const phpsession = "abcd232ef";
const axios = require('axios');
var instance = axios.create({
	baseURL: 'https://leekwars.com/api',
	timeout: 20000,
});

var token;
var login;
var leekcounts;
var leeks = [];

async function login(login, password) {
	let data = axios.get(
		`${baseURL}/farmer/login-token/${login}/${password}`,
	).then((result) => {
		login = result.data['farmer']['login'];
		token = result.data['token'];
		leekcounts = result.data['farmer']['leek_count'];
		leeks = result.data['farmer']['leeks'];

		instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		if (typeof window === 'undefined') {
			instance.defaults.headers.common['Cookie'] = `PHPSESSID=${phpsession}`;
		}
		return true;
	}).catch((err) => {
		return false;
	});
	return data;
}

function storeToken() {
	localStorage.setItem('token', token);
}

async function loginWithToken() {
	token = localStorage.getItem('token', token);
	instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	if (typeof window === 'undefined') {
		instance.defaults.headers.common['Cookie'] = `PHPSESSID=${phpsession}`;
	}

	let result = instance.get('/farmer/get-from-token').then((response) => {
		login = response.data['farmer']['login'];
		leekcounts = response.data['farmer']['leek_count'];
		leeks = response.data['farmer']['leeks'];

		return response.data;
	}).catch((err) => {
		return err;
	});
	return result;
}


async function leekOpponents(leek_id) {
	let data = instance.get(
		`/garden/get-leek-opponents/${leek_id}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err);
	});
	return data;
}

async function farmerOpponents() {
	let data = instance.get(
		`/garden/get-farmer-opponents`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err.data);
	});
	return data;
}

async function leekFight(leek_id, target_id, with_middle=false) {
	if (typeof leek_id == 'string') {
		leek_id = parseInt(leek_id);
	}
	if (typeof target_id == 'string') {
		target_id = parseInt(target_id);
	}
	if (with_middle) {
		let data = axios.get(
			`${middleURL}?type=fightLeek&farmer&token=${token}&leek_id=${leek_id}&target_id=${target_id}`
		).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err);
		});
		return data;
	} else {
		let data = instance.get(
			`/garden/start-solo-fight/${leek_id}/${target_id}`,
		).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err.data);
		});
		return data;
	}
}

async function farmerFight(target_id, with_middle=false) {
	if (with_middle) {
		let data = axios.get(
			`${middleURL}?type=fightFarmer&token=${token}&target_id=${target_id}`
		).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err);
		});
		return data;
	} else {
		let data = instance.get(
			`/garden/start-farmer-fight/${target_id}`,
		).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err.data);
		});
		return data;
	}
}

async function leekChallenge(leek_id, target_id) {
	if (typeof leek_id == 'string') {
		leek_id = parseInt(leek_id);
	}
	if (typeof target_id == 'string') {
		target_id = parseInt(target_id);
	}
	let seed = Math.floor(Math.random() * 10000) + 1;
	let data = instance.get(
		`/garden/start-solo-challenge/${leek_id}/${target_id}/${seed}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err.data);
	});
	return data;
}

async function farmerChallenge(target_id) {
	let seed = Math.floor(Math.random() * 10000) + 1;
	let data = instance.get(
		`/garden/start-farmer-challenge/${target_id}/${seed}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err.data);
	});
	return data;
}

function getLeeks() {
	return leeks;
}

async function getFight(fight_id) {
	let data = instance.get(
		`/fight/get/${fight_id}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err);
	});
	return data;
}

async function getFightResult(fight_id) {
	let f = await getFight(fight_id);
	while (f['report'] == null) {
		sleep(1000);
		f = await getFight(fight_id);
	}
	return f;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function leekBatchFights(leek_id, batchsize, with_middle=false, fast=false, callback=console.log) {
	var fights = [];
	var last_fight;
	let idx = 0;
	for (let i = 0; i < batchsize; i++) {
		if (idx == 4) {
			idx = 0;
		}
		let tmp = await leekOpponents(leek_id);
		opponents = tmp['opponents'];
		let fight = await leekFight(leek_id, opponents[idx++].id, with_middle);
		fights.push(fight['fight']);
		if (fast || fight['fight'] === undefined) {
			if (fight['fight'] != undefined) {
				callback(await getFight(fight['fight']));
			}
			continue;
		}
		callback(await getFightResult(fight['fight']));
	}
	return fights;
}

async function farmerBatchFights(batchsize, with_middle=false, fast=false, callback=console.log) {
	var fights = [];
	var last_fight;
	let idx = 0;
	for (let i = 0; i < batchsize; i++) {
		if (idx == 4) {
			idx = 0;
		}
		let tmp = await farmerOpponents();
		opponents = tmp['opponents'];
		let fight = await farmerFight(opponents[idx++].id, with_middle);
		fights.push(fight['fight']);
		if (fast || fight['fight'] === undefined) {
			if (fight['fight'] != undefined) {
				callback(await getFight(fight['fight']));
			}
			continue;
		}
		callback(await getFightResult(fight['fight']));
	}
	return fights;
}



exports.login = login;
exports.storeToken = storeToken;
exports.loginWithToken = loginWithToken;
exports.getLeeks = getLeeks;
exports.leekOpponents = leekOpponents;
exports.farmerOpponents = farmerOpponents;
exports.leekFight = leekFight;
exports.farmerFight = farmerFight;
exports.leekChallenge = leekChallenge;
exports.farmerChallenge = farmerChallenge;
exports.getFight = getFight;
exports.getFightResult = getFightResult;
exports.leekBatchFights = leekBatchFights;
exports.farmerBatchFights = farmerBatchFights;