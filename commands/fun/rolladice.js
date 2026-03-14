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

        // 4. Sistemi di sicurezza (anti-troll)
        if (quantita < 1 || quantita > 100) {
            return interaction.reply({ content: 'Puoi tirare da 1 a un massimo di 100 dadi alla volta.', ephemeral: true });
        }
        if (facce < 2 || facce > 100) {
            return interaction.reply({ content: 'Il roll deve avere tra 2 e 100 facce.', ephemeral: true });
        }

        // 5. Iniziamo a tirare i dadi!
        let totale = 0;
        let risultati = []; // Qui salveremo tutti i singoli tiri

        for (let i = 0; i < quantita; i++) {
            const tiro = Math.floor(Math.random() * facce) + 1;
            risultati.push(tiro); // Aggiungiamo il tiro alla lista
            totale += tiro;       // Aggiungiamo il tiro al totale
        }

        // 6. Costruiamo il messaggio visivo
        if(quantita>1){
        const embedDadi = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`🎲 Hai tirato ${quantita}d${facce}`)
            // Mostriamo i singoli tiri separati da virgola, e poi la somma totale in grassetto
            .setDescription(`**Risultati:** ${risultati.join(', ')}\n\n**Totale:** **${totale}**`)
            .setTimestamp();
        }
        else {
            const embedDadi = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`🎲 Hai tirato ${quantita}d${facce}`)
            // Mostriamo i singoli tiri separati da virgola, e poi la somma totale in grassetto
            .setDescription(`**Totale:** **${totale}**`)
            .setTimestamp();
        }
        await interaction.reply({ embeds: [embedDadi] });
    }
}