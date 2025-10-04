const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { sleep } = require('./utils.js');
const { token } = require('./config.json');
const { startServer } = require('./potutil.js');

console.log('Iniciando o servidor PO...');

(async () => {
	startServer();
	await sleep(2000);
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.commands = new Collection();

	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandsFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			}
			else {
				console.log(`[AVISO] O comando localizado em ${filePath} não possui um dos atributos necessários (data ou execute)`);
			}
		}
	}

	client.login(token);
})();

