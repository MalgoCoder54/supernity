const axios = require('axios');

module.exports = async function (context, req) {
    const API_KEY = process.env.API_KEY;
    const ENDPOINT = 'https://openaimalgo.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview';

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

    if (!clientMessages || !Array.isArray(clientMessages)) {
        context.res = {
            status: 400,
            body: { error: 'Richiesta non valida: mancano i messaggi.' }
        };
        return;
    }

    // Trasforma i messaggi nel formato richiesto dall'API
    const messages = clientMessages.map(msg => {
        const contentText = msg.content.map(item => item.text).join('\n');
        return {
            role: msg.role,
            content: contentText
        };
    });

    const payload = {
        messages: messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800
    };

    try {
        const response = await axios.post(ENDPOINT, payload, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
            },
        });

        context.res = {
            status: 200,
            body: response.data
        };
    } catch (error) {
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
