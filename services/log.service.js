import chalk from 'chalk';
import dedent from 'dedent-js';

export const printError = (error) => {
	console.log(`${chalk.bgRed(' ОШИБКА ')} ${error}`);
}

export const printSuccess = (msg) => {
	console.log(`${chalk.bgGreen(' УСПЕХ ')} ${msg}`);
}

export const printHelp = () => {
	console.log(dedent(
		`${chalk.bgCyan(' ПОМОЩЬ ')}
		Без параметров - вывод погоды
		-h для вывода помощи
		-s [CITY] для установки города
		-t [API_KEY] для установки токена
		`
	));
}

export const printWeather = (res, icon) => {
	console.log(dedent(
		`${chalk.bgYellow(' ПОГОДА ')}
		Погода в городе ${res.name}
		===========================
		${icon} ${res.weather[0].description}
		Температура: ${Math.round(res.main.temp)} (ощущается как ${Math.round(res.main.feels_like)})
		Влажность: ${res.main.humidity}%
		Скорость ветра: ${Math.round(res.wind.speed)}
		`
	));
}