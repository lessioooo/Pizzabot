const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sends a GIF!')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('GIF category')
                .setRequired(true)
                .addChoices(
                    { name: 'Funny', value: 'funny' },
                    { name: 'Meme', value: 'meme' },
                    { name: 'Movie', value: 'movie' },
                )),
                
    async execute(interaction) {
        const category = interaction.options.getString('category');
                let gifUrl = '';
        let title = '';
		switch (category) {
			case 'funny': 
			 gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWF2N2N4c3hqOWg5ZTJ5a2R0bnd0cGNpYnRrMWhwbGk5bDdnbWk2dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DeAIC76F52wqk/giphy.gif'; // Gatto che cade
            title = 'LOL! 😂';
			break;
			case 'meme' :            
			 gifUrl = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzRocTM4d3UyeGxudmRwZW1ocGdtYnh1cndwbW93cHI2c29tcXdpNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sIIhZliB2McAo/giphy.gif'; // Rick Roll
            title = 'Meme time! 🐸';
			break;
			case 'movie':
			gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG13bjI0amczeWloYTd5YnRtZmg2dGZrZDN6d290dnh1eHRxcTRuZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fSSbirL3Ew0zC/giphy.gif'; // Film
            title = 'Scena da film! 🎬';
			break;
		}
        // --- CREAZIONE DELL'EMBED ---
        const embed = new EmbedBuilder()
            .setTitle(title) // Il titolo sopra la GIF
            .setColor(0x0099FF) // Colore della barra laterale (Blu)
            .setImage(gifUrl) // <--- QUESTO È IL COMANDO MAGICO: Mostra l'immagine grande
            .setFooter({ text: `Requested from ${interaction.user.username}` });

        // Inviamo l'embed invece del messaggio di testo semplice
        await interaction.reply({ embeds: [embed] });
    },
};