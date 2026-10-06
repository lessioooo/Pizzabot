# Usa un'immagine ufficiale di Node.js (Alpine è molto leggera)
FROM node:20-alpine

# Imposta la cartella di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia i file delle dipendenze
COPY package*.json ./

# Installa solo le dipendenze necessarie per la produzione
RUN npm install --omit=dev

# Copia tutto il resto del codice
COPY . .

# Comando per avviare il bot
CMD ["node", "index.js"]