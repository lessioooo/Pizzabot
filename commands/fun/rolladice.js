const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Tira uno o più dadi!')
        .addStringOption(option =>
            option.setName('lancio') 
                .setDescription('Scrivi cosa tirare (es. 2d6, 1d20, 4d8)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString('lancio').toLowerCase().trim();

        const regex = /^(\d+)?d(\d+)$/;
        const match = input.match(regex);

        if (!match) {
            return interaction.reply({ 
                content: '❌ Formato non valido! Usa il formato NdF (es. `2d6`, `1d20`, `3d8`).', 
                ephemeral: true 
            });
        }

        const quantita = match[1] ? parseInt(match[1]) : 1; 
        const facce = parseInt(match[2]);
        const faccePermesse= [4,6,8,10,12,20,100];

        if (quantita < 1 || quantita > 100) {
            return interaction.reply({ content: 'Puoi tirare da 1 a un massimo di 100 dadi alla volta.', ephemeral: true });
        }
        if (!faccePermesse.includes(facce)) {
            return interaction.reply({ content: 'Il dado deve essere un dado esistente! (d4, d6, d8, d10, d12, d20, d100).', ephemeral: true });
        }


       let totale = 0;
        let risultatiFormattati = [];

        for (let i = 0; i < quantita; i++) {
            const tiro = Math.floor(Math.random() * facce) + 1;
            totale += tiro;

            if (facce === 20) {
                if (tiro === 1) {
                    risultatiFormattati.push(`\u001b[31m${tiro}\u001b[0m`); 
                } else if (tiro === 20) {
                    risultatiFormattati.push(`\u001b[32m${tiro}\u001b[0m`); 
                } else {
                    risultatiFormattati.push(`\u001b[0m${tiro}`); 
                }
            } else {
                risultatiFormattati.push(`\u001b[0m${tiro}`);
            }
        }
        const embedDadi = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`🎲 Hai tirato ${quantita}d${facce}`)
        .setTimestamp();

        if(quantita>1){
            embedDadi.setDescription(
                `**Risultati:**\n` + 
                `\`\`\`ansi\n${risultatiFormattati.join(', ')}\n\`\`\`\n` + 
                `**Totale:** \`${totale}\``
            );
        }else{
            if(facce===20)
            {
                if(totale===1) embedDadi.setColor(0x00FF0000);
                if(totale===20) embedDadi.setColor(0x00FF00);
                
            }
            embedDadi.setDescription(
                `**Risultato:**\n` + 
                `\`\`\`ansi\n${risultatiFormattati[0]}\n\`\`\``
            );
        }
        try {
            await interaction.reply({ embeds: [embedDadi] });
        } catch (error) {
            console.error("Errore durante l'invio dell'embed:", error);
            await interaction.reply({ content: "Si è verificato un errore nell'invio del risultato.", ephemeral: true });
        }
    }
}