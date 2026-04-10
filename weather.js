#!/usr/bin/env node

import { getArgs } from './helpers/args.js';
import { getGEO, getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKV, TOKEN_DICTIONARY, getKV } from './services/storage.service.js';

const saveToken = async (token) => {
	if (!token.length) {
		printError('Токен не передан');

		return;
	}

	try {
		await saveKV(TOKEN_DICTIONARY.token, token);
		
		printSuccess('Токен сохранен');
	} catch (e) {
		printError(e.message);
	}
}

const saveCity = async (city) => {
	if (!city.length) {
		printError('Город не передан');

		return;
	}

	try {
		await getGEO(city);
		await saveKV(TOKEN_DICTIONARY.city, city);
		
		printSuccess('Город сохранен');
	} catch (e) {
		printError(e.message);
	}
}

const getForecast = async () => {
	try {
		const city = process.env.CITY ?? await getKV(TOKEN_DICTIONARY.city);

		const weather = await getWeather(city);

		printWeather(weather, getIcon(weather.weather[0].icon));
	} catch (e) {
		if (e instanceof Error) {
			printError(e.message);
		}
	}
}

const initCLI = () => {
	const args = getArgs(process.argv)
	
	if (args.h) {
		return printHelp();
	}

	if (args.s) {
		return saveCity(args.s);
	}

	if (args.t) {
		return saveToken(args.t);
	}

	return getForecast();
};

initCLI();