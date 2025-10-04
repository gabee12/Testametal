const { REST, Routes } = require('discord.js');
const { token, appId, guildId } = require('./config.json');
const fs = require('fs');
const path = require('path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandsFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[AVISO] O comando localizado em ${filePath} não possui um dos atributos necessários (data ou execute)`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Atualizando ${commands.length} comandos do aplicativo`);

		const data = await rest.put(
			Routes.applicationGuildCommands(appId, guildId),
			{ body: commands },
		);

		console.log(`${data.length} comandos atualizados com sucesso!`);
	}
	catch (error) {
		console.error(error);
	}
})();