const API_KEY = "AIzaSyBHN_-AqOwAh9Xc9oGYC4XOpw1WUfGX5qs"; // Replace with your API Key

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';  
recognition.interimResults = false; 

let isSpeaking = false; // Flag to track AI response

document.getElementById("start-btn").addEventListener("click", () => {
    isSpeaking = false;  // Reset flag
    recognition.start();
});

document.getElementById("stop-btn").addEventListener("click", () => {
    isSpeaking = false;  // Stop AI response before it speaks
    window.speechSynthesis.cancel(); // Stop speaking immediately
    console.log("AI response stopped.");
});

// When the user speaks
recognition.onresult = async (event) => {
    let userSpeech = event.results[0][0].transcript.toLowerCase();
    document.getElementById("output").innerText = "You said: " + userSpeech;
    
    isSpeaking = true;  // AI is now responding
    let response = await askGemini(userSpeech);
    document.getElementById("output-ai").innerText = "Ai said: " + response;
    if (isSpeaking) {
        speak(response); // Only speak if not stopped
    }
};

async function askGemini(text) {
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY;

    const requestBody = {
        contents: [{ role: "user", parts: [{ text: text }] }]
    };

    try {
        let response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        let data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure about that.";
    } catch (error) {
        console.error("Error fetching from Gemini:", error);
        return "Sorry, I couldn't connect to Gemini.";
    }
}

// Text-to-Speech (TTS) with Stop Functionality
function speak(text) {
    if (!isSpeaking) return; // Don't speak if AI response was stopped

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'hi-IN';
    speech.rate = 1;
    speech.pitch = 1;

    // Start speaking
    window.speechSynthesis.speak(speech);
}
