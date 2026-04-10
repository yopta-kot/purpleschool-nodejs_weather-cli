import { homedir } from 'os';
import { join } from 'path';	
import { promises } from 'fs';	

const FILE_PATH = join(homedir(), 'weather-data.json')

export const TOKEN_DICTIONARY = {
	token: 'token',
	city: 'city',
}

const isExist = async (path) => {
	try {
		await promises.stat(path);

		return true;
	} catch {
		return false;
	}
}

export const getKV = async (key) => {
	if (await isExist(FILE_PATH)) {
		const file = await promises.readFile(FILE_PATH);
		const data = JSON.parse(file);

		return data[key];
	}

	return undefined;
}

export const saveKV = async (key, value) => {
	let data = {};

	if (await isExist(FILE_PATH)) {
		const file = await promises.readFile(FILE_PATH);
		
		data = JSON.parse(file);
	}

	data[key] = value;

	await promises.writeFile(FILE_PATH, JSON.stringify(data));
}