import { capitalize } from '../helpers/string.js';
import { getKV, TOKEN_DICTIONARY } from './storage.service.js';

const getToken = async () => {
	const token = process.env.TOKEN ?? await getKV(TOKEN_DICTIONARY.token);

	if (!token) {
		throw new Error('Токен не задан. Используйте -t [API_KEY] что бы установить его.');
	}

	return token;
}

export const getIcon = (icon) => {
	switch(icon.slice(0, -1)) {
		case '01':
			return '☀️';
		case '02':
			return '🌤️';
		case '03':
			return '☁️';
		case '04':
			return '☁️';
		case '09':
			return '🌧️';
		case '10':
			return '🌦️';
		case '11':
			return '🌩️';
		case '13':
			return '❄️';
		case '50':
			return '🌫️';
	}
}

export const getGEO = async (city) => {
	const token = await getToken();

	try {
		const url = new URL('http://api.openweathermap.org/geo/1.0/direct');
		url.searchParams.append('q', city);
		url.searchParams.append('appid', token);
		url.searchParams.append('limit', 1);

		const req = await fetch(url);
		const res = await req.json();

		if (!res.length) {
			throw new Error('Некорректный город.');
		}

		return {
			lat: res[0].lat,
			lon: res[0].lon,
		}
	} catch(e) {
		throw e;
	}
}

export const getWeather = async (city) => {
	const token = await getToken();

	try {
		// @deprecated
		// const url = new URL('https://api.openweathermap.org/data/2.5/weather');
		// url.searchParams.append('q', city);
		// url.searchParams.append('appid', token);
		// url.searchParams.append('lang', 'ru');
		// url.searchParams.append('units', 'metric');

		// const req = await fetch(url);
		// const result = await req.json();

		const { lat, lon } = await getGEO(city);

		const url = new URL('https://api.openweathermap.org/data/2.5/weather');
		url.searchParams.append('lat', lat);
		url.searchParams.append('lon', lon);
		url.searchParams.append('appid', token);
		url.searchParams.append('lang', 'ru');
		url.searchParams.append('units', 'metric');

		const req = await fetch(url);
		const result = await req.json();

		if ('cod' in result && result.cod !== 200) {
			throw new Error(capitalize(result.message));
		}

		return result;
	} catch (e) {
		throw e;
	}
}