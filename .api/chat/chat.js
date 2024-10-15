const axios = require('axios');

module.exports = async function (context, req) {
    const API_KEY = process.env.API_KEY;
    const ENDPOINT = process.env.ENDPOINT;

    // Verifica che la chiave API sia presente
    if (!API_KEY) {
        context.log.error('La chiave API non è stata trovata nelle variabili d\'ambiente.');
        context.res = {
            status: 500,
            body: { error: 'Errore del server: chiave API mancante.' }
        };
        return;
    }

    const clientMessages = req.body.messages;

    // Verifica la presenza dei messaggi e che siano un array
    if (!clientMessages || !Array.isArray(clientMessages)) {
        context.res = {
            status: 400,
            body: { error: 'Richiesta non valida: mancano i messaggi.' }
        };
        return;
    }

    // Utilizza direttamente i messaggi forniti dal client
    const messages = clientMessages;

    // Prepara il payload da inviare all'API di OpenAI
    const payload = {
        messages: messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800
    };

    try {
        // Log per il debug
        context.log('Payload inviato all\'API di OpenAI:', JSON.stringify(payload));

        // Effettua la richiesta all'API di OpenAI
        const response = await axios.post(ENDPOINT, payload, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
            },
        });

        // Log della risposta per il debug
        context.log('Risposta ricevuta dall\'API di OpenAI:', response.data);

        // Restituisci la risposta ricevuta dall'API
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: response.data
        };
    } catch (error) {
        // Log dell'errore per il debug
        context.log.error('Errore nella richiesta all\'API di OpenAI:', error.message);
        context.res = {
            status: 500,
            body: {
                error: 'Errore nella richiesta all\'API di OpenAI.',
                details: error.response ? error.response.data : error.message
            }
        };
    }
};
