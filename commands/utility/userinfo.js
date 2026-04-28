const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Ottieni le informazioni su un utente.')
        .addUserOption(option => option.setName('utente')
            .setDescription('L\'utente di cui vuoi ottenere le informazioni.')
            .setRequired(false)
        ),

    async execute(interaction) {
        const utenteTarget = interaction.options.getUser('utente') || interaction.user;
        
        let utenteMembro = null;
        try {
            utenteMembro = await interaction.guild.members.fetch(utenteTarget.id);
        } catch (error) {
            console.log("L'utente non fa parte del server.");
        }

        const userAvatar = utenteTarget.displayAvatarURL({ dynamic: true, size: 512 });
        const accountCreato = `<t:${parseInt(utenteTarget.createdTimestamp / 1000)}:R>`;

        const embed = new EmbedBuilder()
            .setTitle('Informazioni su ' + utenteTarget.username)
            .setThumbnail(userAvatar)
            .addFields(
                { name: '👤 Nome utente: ', value: `${utenteTarget.username}`, inline: true },
                { name: '🆔 ID utente: ', value: `${utenteTarget.id}`, inline: true },
                { name: '📅 Account creato: ', value: accountCreato, inline: false },
            )
            .setFooter({ text: `Richiesto da ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (utenteMembro) {
            const serverEntrato = `<t:${parseInt(utenteMembro.joinedTimestamp / 1000)}:R>`;

            embed.addFields(
                { name: '📅 Entrato nel server: ', value: serverEntrato, inline: false }
            );
        }

        await interaction.reply({ embeds: [embed] });
    },
};
