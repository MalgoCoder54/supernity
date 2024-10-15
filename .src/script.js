// Logica per il modal del chatbot
// Variabile per memorizzare i messaggi della sessione
// Script per il Chatbot
const chatbotButton = document.getElementById("chatbot-button");
const chatbotModal = document.getElementById("chatbot-modal");
const closeModal = document.querySelector(".close");
const sendButton = document.getElementById("send-button");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");

// Mostra/Nasconde il modal del chatbot
chatbotButton.addEventListener("click", () => {
    chatbotModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    chatbotModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == chatbotModal) {
        chatbotModal.style.display = "none";
    }
});

// Invia il messaggio dell'utente e risposta simulata del bot
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === "") return;

    // Aggiungi il messaggio dell'utente alla chat
    appendMessage("user", messageText);
    userInput.value = "";

    // Simula una risposta del bot
    setTimeout(() => {
        const botReply = "Servizio disponibile a breve. Per ulteriori informazioni, contatta il nostro supporto.";
        appendMessage("bot", botReply);
    }, 1000);
}

// Funzione per aggiungere un messaggio alla chat
function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);

    const messageText = document.createElement("p");
    messageText.textContent = message;
    messageElement.appendChild(messageText);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scrolla automaticamente verso il basso
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
