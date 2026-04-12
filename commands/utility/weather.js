const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const interpretaMeteo = (codice) => {
    const mappa = {
        0: {desc: 'Sereno', emoji: '☀️'},
        1: {desc: 'Poco nuvoloso', emoji: '🌤️'},
        2: {desc: 'Parzialmente nuvoloso', emoji: '⛅'},
        3: {desc: 'Nuvoloso', emoji: '☁️'},
        45: {desc: 'Nebbia', emoji: '🌫️'},
        51: {desc: 'Pioggia leggera', emoji: '🌧️'}, 
        71: {desc: 'Neve', emoji: '🌨️'},
        95: {desc: 'Temporale', emoji: '⛈️'}
    };
     return mappa[codice] || { desc: 'Condizioni miste', emoji: '🌡️' };
};   
    module.exports = {
        data: new SlashCommandBuilder()
            .setName('meteo')
            .setDescription('Ottieni le condizioni meteo attuali per una città.')
            .addStringOption(option =>
                option.setName('città')
                    .setDescription('Il nome della città')
                    .setRequired(true)),

    async execute(interaction) {

        await interaction.deferReply();

        const nomeCitta = interaction.options.getString('città');
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCitta}&count=1&language=it`;

        const risposta = await fetch(url);
        const dati = await risposta.json();

        if (!dati.results || dati.results.length === 0) {
            await interaction.editReply({ content: `Non ho trovato la città "${nomeCitta}".`, ephemeral: true });
            return;
        }

        const { latitude, longitude, name, country } = dati.results[0];

        const urlMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
    
        const rispostaMeteo = await fetch(urlMeteo);
        const datiMeteo = await rispostaMeteo.json();

         const condizioni = interpretaMeteo(datiMeteo.current.weather_code);

        const embed = new EmbedBuilder()
        .setTitle(`Meteo attuale a ${name}, ${country}`)
        .setDescription(
        `🌡️ **Temperatura:** ${datiMeteo.current.temperature_2m}°C\n` +
        `💦 **Umidità:** ${datiMeteo.current.relative_humidity_2m}%\n` +
        `☂️ **Condizioni:**  ${condizioni.desc} ${condizioni.emoji}`
    )
        .setFooter({ 
            text: `Richiesto da ${interaction.user.username}`, 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        },   
    };