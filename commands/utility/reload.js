const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption((option) => 
			option.setName('file')
			.setDescription('The command file name to reload (without .js, e.g., coin).')
			.setRequired(true)
		),

	async execute(interaction) {
		const fileName = interaction.options.getString('file', true);
		const commandsDir = path.join(__dirname, '..');
		let fullPath = null;

		const folders = fs.readdirSync(commandsDir).filter(item => {
			const itemPath = path.join(commandsDir, item);
			return fs.statSync(itemPath).isDirectory();
		});

		for (const folder of folders) {
			const potentialPath = path.join(commandsDir, folder, `${fileName}.js`);
			if (fs.existsSync(potentialPath)) {
				fullPath = potentialPath;
				break;
			}
		}

		if (!fullPath) {
			return interaction.reply(`Could not find a command file named \`${fileName}.js\` in any subfolder.`);
		}

		try {
			delete require.cache[require.resolve(fullPath)];
			const newCommand = require(fullPath);
			if ('data' in newCommand && 'execute' in newCommand) {
				interaction.client.commands.set(newCommand.data.name, newCommand);
				await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
			} else {
				await interaction.reply(`The file \`${fileName}.js\` is not a valid command.`);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply(`Error reloading \`${fileName}.js\`: \`${error.message}\``);
		}
	},
};