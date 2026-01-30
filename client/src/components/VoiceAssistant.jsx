import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Activity } from 'lucide-react';
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

    const speak = (text) => {
        if (!text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to select a "Google" voice or a reliable English voice
        const preferredVoice = voices.find(v => v.name.includes("Google US English")) ||
            voices.find(v => v.name.includes("Google")) ||
            voices.find(v => v.lang.startsWith("en-"));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    // Auto-stop after 2 seconds of silence
    useEffect(() => {
        if (transcript && listening) {
            const timer = setTimeout(() => {
                if (transcript.trim().length > 0) {
                    SpeechRecognition.stopListening();
                }
            }, 2000); // 2 seconds silence

            return () => clearTimeout(timer);
        }
    }, [transcript, listening]);

    // Handle when listening stops (either manually or via timeout)
    useEffect(() => {
        if (!listening && transcript && !isProcessing) {
            handleVoiceCommand(transcript);
        }
    }, [listening, transcript, isProcessing]);

    const handleVoiceCommand = async (finalTranscript) => {
        const textToSend = finalTranscript || transcript;
        if (!textToSend || textToSend.trim() === '') return;

        console.log("Processing Command:", textToSend);
        setIsProcessing(true);

        try {
            const res = await api.post('/voice/process', { transcript: textToSend });
            console.log("Server Response:", res.data);

            if (onAction) onAction(res.data);

            // Speak the response
            if (res.data.message) {
                speak(res.data.message);
            }

        } catch (err) {
            console.error("Voice Error:", err);
            speak("Sorry, I'm having trouble connecting right now.");
        }

        setIsProcessing(false);
        resetTranscript();
    };

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className={`
        relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300
        ${listening ? 'bg-[#ea4335] scale-110 shadow-red-500/30' :
                    isSpeaking ? 'bg-[#34a853] scale-110 shadow-green-500/30' :
                        'bg-white hover:bg-[#f8f9fa] shadow-md'}
        ${isProcessing ? 'ring-4 ring-[#1a73e8]/20' : ''}
      `}>
                {/* Ripple Effect for Listening */}
                {listening && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#ea4335] opacity-30 animate-ping"></span>
                )}

                {/* Ripple Effect for Speaking */}
                {isSpeaking && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-30 animate-ping"></span>
                )}

                <button
                    onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
                    className={`relative z-10 p-4 focus:outline-none transition-colors ${listening || isSpeaking ? 'text-white' : 'text-[#5f6368]'}`}
                >
                    {listening ? <MicOff size={28} /> : isSpeaking ? <Activity size={28} /> : <Mic size={28} className="text-[#1a73e8]" />}
                </button>
            </div>

            {/* Transcript Popup */}
            {(transcript || isProcessing || isSpeaking) && (
                <div className="absolute bottom-20 right-0 w-72 p-4 bg-white rounded-xl shadow-xl border border-[#dadce0] text-sm mb-2 transition-all animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-2 text-[#5f6368] text-xs uppercase tracking-wider font-bold">
                        <Activity size={12} className={listening ? "animate-pulse text-[#ea4335]" : isSpeaking ? "animate-pulse text-[#34a853]" : ""} />
                        {listening ? "Listening..." : isProcessing ? "Thinking..." : isSpeaking ? "Speaking..." : "Heard"}
                    </div>
                    <p className="text-[#202124] italic text-lg leading-relaxed">
                        "{listening || isProcessing ? transcript : "..."}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
