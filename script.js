
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    appendMessage("You", userInput);
    fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message: userInput })
    })
    .then(res => res.json())
    .then(data => {
        appendMessage("Kaif", data.reply);
        speak(data.reply);
        if (data.image_url) showImage(data.image_url);
    });
    document.getElementById("user-input").value = '';
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showImage(url) {
    const chatBox = document.getElementById("chat-box");
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Generated Image";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "10px";
    chatBox.appendChild(img);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN';
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        sendMessage();
    };
    recognition.start();
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[^ -]+/.test(text) ? 'hi-IN' : 'en-US';
    speechSynthesis.speak(utterance);
}

window.onload = () => {
    appendMessage("Kaif", "Hi! I'm Mohd. Kaif — your AI voice assistant. Aap kya jaanna chahenge?");
};
