// scripts.js

let recognition; // Declare the recognition object

// Function to open the speech interface modal
function openSpeechModal() {
    const speechInterface = document.querySelector('.speech-interface');
    speechInterface.style.display = 'block';
}

// Function to close the speech interface modal
function closeSpeechModal() {
    const speechInterface = document.querySelector('.speech-interface');
    speechInterface.style.display = 'none';
    stopSpeechRecognition(); // Stop speech recognition when closing the modal
}

// Function to start speech recognition
function startSpeechRecognition() {
    const speechToTextBtn = document.getElementById('speechToTextBtn');
    const speechToTextInput = document.getElementById('speechToTextInput');
    const langSelect = document.getElementById('langSelect');

    const lang = langSelect.value; // Get the selected language code

    if (!recognition) {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition(); // Initialize the recognition object
        recognition.lang = lang; // Set the language
        recognition.continuous = true; // Continuous listening
        recognition.interimResults = true; // Get interim results

        recognition.onstart = () => {
            speechToTextBtn.textContent = 'Stop Listening';
        };

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1][0].transcript;
            speechToTextInput.textContent = result;
        };

        recognition.onend = () => {
            speechToTextBtn.textContent = 'Start Listening';
        };
    }

    recognition.start();
}

// Function to stop speech recognition
function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// Function to convert text to speech in the specified language
function textToSpeech() {
    const textToSpeechInput = document.getElementById('textToSpeechInput');
    const langSelect = document.getElementById('langSelect');
    const textToSpeechOutput = document.getElementById('textToSpeechOutput');

    const text = textToSpeechInput.value;
    const lang = langSelect.value; // Get the selected language code

    if (text && lang) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = lang;
        window.speechSynthesis.speak(speech);
        textToSpeechOutput.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    }
}

// Attach event listeners to open and close the modal
document.getElementById('openSpeechModalBtn').addEventListener('click', openSpeechModal);
document.querySelector('.speech-interface').addEventListener('click', (event) => {
    if (event.target.classList.contains('speech-interface')) {
        closeSpeechModal();
    }
});


document.getElementById('speechToTextBtn').addEventListener('click', () => {
    if (recognition && recognition.isStarted) {
        stopSpeechRecognition();
    } else {
        startSpeechRecognition();
    }
});



let isPlaying = false; // Track whether audio is playing


function toggleAudioPlayback() {
    const textToSpeechOutput = document.getElementById('textToSpeechOutput');

    if (isPlaying) {
        textToSpeechOutput.pause();
    } else {
        textToSpeechOutput.play();
    }

    isPlaying = !isPlaying;
}

document.getElementById('textToSpeechOutput').addEventListener('play', () => {
    isPlaying = true;
});
document.getElementById('textToSpeechOutput').addEventListener('pause', () => {
    isPlaying = false;
});

document.getElementById('textToSpeechBtn').addEventListener('click', textToSpeech);

