import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Activity, Languages } from 'lucide-react';
import api from '../services/api';

const VoiceAssistant = ({ onAction }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const [language, setLanguage] = useState('en-US');

    // ... Load voices useEffect (kept same)

    const speak = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        let preferredVoice = null;
        // Prioritize Hindi voices if language is Hindi
        if (language === 'hi-IN') {
            preferredVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
        } else {
            preferredVoice = voices.find(v => v.name.includes("Google US English")) ||
                voices.find(v => v.name.includes("Google")) ||
                voices.find(v => v.lang.startsWith("en-"));
        }

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.lang = language;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    // ... Auto stop useEffect (kept same)

    // ... Listening stop useEffect (kept same)

    const handleVoiceCommand = async (finalTranscript) => {
        const textToSend = finalTranscript || transcript;
        if (!textToSend || textToSend.trim() === '') return;

        console.log("Processing Command:", textToSend);
        setIsProcessing(true);

        try {
            const res = await api.post('/voice/process', {
                transcript: textToSend,
                language: language
            });
            console.log("Server Response:", res.data);

            if (onAction) onAction(res.data);

            if (res.data.message) {
                speak(res.data.message);
            }

        } catch (err) {
            console.error("Voice Error:", err);
            speak(language === 'hi-IN' ? "Maaf karein, connection error hai." : "Sorry, I'm having trouble connecting right now.");
        }

        setIsProcessing(false);
        resetTranscript();
    };

    const toggleLanguage = () => {
        const newLang = language === 'en-US' ? 'hi-IN' : 'en-US';
        setLanguage(newLang);
        if (listening) {
            SpeechRecognition.stopListening();
            // Allow a brief pause before restarting to ensure clear state switch
            setTimeout(() => SpeechRecognition.startListening({ language: newLang, continuous: true }), 100);
        }
    };

    const startListening = () => SpeechRecognition.startListening({ language, continuous: true });

    if (!browserSupportsSpeechRecognition) {
        return null;
    }


