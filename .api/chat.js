const axios = require('axios');

module.exports = async function (context, req) {
    const API_KEY = process.env.API_KEY;
    const ENDPOINT = 'https://openaimalgo.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview';

    const clientMessages = req.body.messages;

    // Trasforma i messaggi nel formato richiesto dall'API
    const messages = clientMessages.map(msg => {
        // Combina i testi nel content
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
        console.error('Errore nella richiesta API:', error.response ? error.response.data : error.message);
        context.res = {
            status: 500,
            body: { error: 'Errore nel server' }
        };
    }
};
