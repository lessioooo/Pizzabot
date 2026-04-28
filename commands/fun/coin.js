const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moneta')
        .setDescription('Lancia una moneta e vedi se esce testa o croce!'),

    async execute(interaction) {
        const risultati = ['Testa', 'Croce'];
        const randomIndex = Math.floor(Math.random() * risultati.length);
        const result = risultati[randomIndex];

        const embed = new EmbedBuilder()
            .setTitle('Esito del lancio della moneta')
            .setDescription(`La moneta è caduta su: ${result}!`)
            .setFooter({ text: `Richiesto da ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor(0x00ff00);  // Green color for better visuals

        await interaction.reply({ embeds: [embed] });
    }
};    