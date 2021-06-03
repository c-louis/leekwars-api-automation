const baseURL = 'https://leekwars.com/api'
const axios = require('axios');
var instance = axios.create({
	baseURL: 'https://leekwars.com/api',
	timeout: 20000,
});

var phpsession = Math.floor(Math.random() * 10000) + 1;
var token;
var login;
var leekcounts;
var leeks = [];

const init = () => {

}

async function login(login, password) {
	let data = axios.get(
		`${baseURL}/farmer/login-token/${login}/${password}`,
	).then((result) => {
		login = result.data['farmer']['login'];
		token = result.data['token'];
		leekcounts = result.data['farmer']['leek_count'];
		leeks = result.data['farmer']['leeks'];

		instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		instance.defaults.headers.common['Cookie'] = `PHPSESSID=${phpsession}`;

		return true;
	}).catch((err) => {
		console.log(err);
		return false;
	});
	return data;
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
		console.log(err);
	});
	return data;
}

async function leekFight(leek_id, target_id) {
	if (typeof leek_id == 'string') {
		leek_id = parseInt(leek_id);
	}
	if (typeof target_id == 'string') {
		target_id = parseInt(target_id);
	}
	let data = instance.get(
		`/garden/start-solo-fight/${leek_id}/${target_id}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err);
	});
	return data;
}

async function farmerFight(target_id) {
	let data = instance.get(
		`/garden/start-farmer-fight/${target_id}`,
	).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err);
	});
	return data;
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
		console.log(err);
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
		console.log(err);
	});
	return data;
}

function getLeeks() {
	return leeks;
}

//garden/get-farmer-opponents → opponents -> Team fight
//garden/get-leek-opponents/leek_id → opponents -> leek fight

exports.login = login;
exports.getLeeks = getLeeks;
exports.leekOpponents = leekOpponents;
exports.farmerOpponents = farmerOpponents;
exports.leekFight = leekFight;
exports.farmerFight = farmerFight;
exports.leekChallenge = leekChallenge;
exports.farmerChallenge = farmerChallenge;