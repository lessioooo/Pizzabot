const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Tira uno o più dadi!')
        .addStringOption(option =>
            option.setName('lancio') // Il "rettangolo vuoto"
                .setDescription('Scrivi cosa tirare (es. 2d6, 1d20, 4d8)')
                .setRequired(true)
        ),
    async execute(interaction) {
        // 1. Prendiamo quello che ha scritto l'utente e lo mettiamo tutto in minuscolo
        const input = interaction.options.getString('lancio').toLowerCase().trim();

        // 2. Controlliamo che il formato sia corretto usando una Regex (espressone regolare)
        // Questa formula magica cerca "numeri + la lettera d + numeri"
        const regex = /^(\d+)?d(\d+)$/;
        const match = input.match(regex);

        // Se l'utente ha scritto "ciao" o "d20d" invece di "2d6", diamo errore
        if (!match) {
            return interaction.reply({ 
                content: '❌ Formato non valido! Usa il formato NdF (es. `2d6`, `1d20`, `3d8`).', 
                ephemeral: true // Lo vede solo l'utente che ha sbagliato
            });
        }

        // 3. Estraiamo la quantità e le facce
        // Se ha scritto solo "d20" senza numero davanti, match[1] è vuoto, quindi impostiamo 1 di default
        const quantita = match[1] ? parseInt(match[1]) : 1; 
        const facce = parseInt(match[2]);
        const faccePermesse= [4,6,8,10,12,20,100];

        // 4. Sistemi di sicurezza (anti-troll)
        if (quantita < 1 || quantita > 100) {
            return interaction.reply({ content: 'Puoi tirare da 1 a un massimo di 100 dadi alla volta.', ephemeral: true });
        }
        if (!faccePermesse.includes(facce)) {
            return interaction.reply({ content: 'Il dado deve essere un dado esistente! (d4, d6, d8, d10, d12, d20, d100).', ephemeral: true });
        }

        // 5. Iniziamo a tirare i dadi!
       let totale = 0;
        let risultatiFormattati = [];

        for (let i = 0; i < quantita; i++) {
            const tiro = Math.floor(Math.random() * facce) + 1;
            totale += tiro;

            // Logica Colore ANSI: solo se è un d20 applichiamo i critici
            if (facce === 20) {
                if (tiro === 1) {
                    risultatiFormattati.push(`\u001b[31m${tiro}\u001b[0m`); // Rosso
                } else if (tiro === 20) {
                    risultatiFormattati.push(`\u001b[32m${tiro}\u001b[0m`); // Verde
                } else {
                    risultatiFormattati.push(`\u001b[0m${tiro}`); // Normale
                }
            } else {
                // Per tutti gli altri dadi (d4, d6, ecc.) usiamo il colore standard
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