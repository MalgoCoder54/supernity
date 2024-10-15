// Logica per il modal del chatbot
// Variabile per memorizzare i messaggi della sessione
let sessionMessages = [];

// Apri il modal del chatbot
document.getElementById("chatbot-button").addEventListener("click", function () {
    document.getElementById("chatbot-modal").style.display = "flex";
});

// Chiudi il modal del chatbot
document.getElementsByClassName("close")[0].addEventListener("click", function () {
    document.getElementById("chatbot-modal").style.display = "none";
});

// Chiudi il modal cliccando fuori dal contenuto
window.onclick = function (event) {
    if (event.target === document.getElementById("chatbot-modal")) {
        document.getElementById("chatbot-modal").style.display = "none";
    }
};

// Gestisci l'invio del messaggio
document.getElementById("send-button").addEventListener("click", sendMessage);

// Permetti l'invio del messaggio premendo "Enter"
document.getElementById("user-input").addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    // Aggiungi il messaggio dell'utente alla chat
    addMessage("user", message);

    // Pulisci il campo di input
    userInput.value = "";

    // Aggiungi il messaggio alla lista della sessione
    sessionMessages.push(message);

    // Simula la risposta del bot
    const botResponse = "Hai scritto questo:<br>" + sessionMessages.join("<br>");
    addMessage("bot", botResponse);

}




async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    // Aggiungi il messaggio dell'utente alla chat
    addMessage("user", message);

    // Pulisci il campo di input
    userInput.value = "";

    // Aggiungi il messaggio alla lista della sessione
    sessionMessages.push(message);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: "Sei un assistente AI chiamato 'Harry Potter' che fornisce informazioni sull'azienda Supernity. Ecco le informazioni che puoi fornire:\n\n[Inserisci qui le informazioni dettagliate come nel tuo prompt Python]\n\nQuando ci sono domande specifiche, rimanda sempre all'email 'info@supernity.it'.\n\nNon rispondere a nulla che non siano domande su Supernity, dicendo 'Hey amico, questo per me è fuori scopo' se ti fanno altre domande."
                    },
                    ...sessionMessages
                ]
            })
        });

        const data = await response.json();

        if (response.ok) {
            const assistantMessage = data.choices[0].message.content;
            addMessage("bot", assistantMessage);

            sessionMessages.push({
                role: 'assistant',
                content: assistantMessage
            });

            if (sessionMessages.length > 20) {
                sessionMessages = sessionMessages.slice(-20);
            }
        } else {
            console.error('Errore nella risposta:', data);
            addMessage("bot", "Si è verificato un errore. Per favore, riprova più tardi.");
        }
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        addMessage("bot", "Si è verificato un errore di connessione. Per favore, controlla la tua connessione internet e riprova.");
    }
}



function addMessage(sender, text) {
    const chatMessages = document.getElementById("chat-messages");

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);

    const messageText = document.createElement("p");
    if (sender === "user") {
        messageText.textContent = text;
    } else {
        messageText.innerHTML = text;
    }

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("timestamp");
    const now = new Date();
    timeStamp.textContent = now.getHours() + ":" + (now.getMinutes()<10?'0':'') + now.getMinutes();

    messageElement.appendChild(messageText);
    messageElement.appendChild(timeStamp);
    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}



// Scorrimento fluido per i link interni
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animazione degli elementi al scroll
function revealOnScroll() {
    let elements = document.querySelectorAll('.soluzione, .team-member');
    let windowHeight = window.innerHeight;
    elements.forEach(function (element) {
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Logica per il modulo di contatto che apre l'app email con campi precompilati
document.getElementById('send-email-button').addEventListener('click', function () {
    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var messaggio = document.getElementById('messaggio').value.trim();

    if (nome && email && messaggio) {
        var destinatario = 'info@supernity.com'; // Sostituisci con il tuo indirizzo email
        var oggetto = 'Nuovo messaggio da ' + nome;
        var corpo = 'Nome: ' + nome + '%0A'
            + 'Email: ' + email + '%0A'
            + 'Telefono: ' + telefono + '%0A%0A'
            + 'Messaggio:%0A' + messaggio;

        var mailtoLink = 'mailto:' + destinatario
            + '?subject=' + encodeURIComponent(oggetto)
            + '&body=' + corpo;

        // Messaggio opzionale per l'utente
        alert('Stiamo aprendo il tuo client di posta elettronica per inviare il messaggio.');

        // Apri il client di posta
        window.location.href = mailtoLink;
    } else {
        alert('Per favore, compila tutti i campi obbligatori (Nome, Email e Messaggio).');
    }
});
