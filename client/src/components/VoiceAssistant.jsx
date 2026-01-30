import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Activity } from 'lucide-react';
import axios from 'axios';

const VoiceAssistant = ({ onAction }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!listening && transcript && !isProcessing) {
            handleVoiceCommand();
        }
    }, [listening]);

    const handleVoiceCommand = async () => {
        if (!transcript) return;
        setIsProcessing(true);
        try {
            // Send to backend
            const res = await axios.post('http://localhost:5000/api/voice/process', { transcript });
            console.log("Server Response:", res.data);
            if (onAction) onAction(res.data);

            // Speak response
            const utterance = new SpeechSynthesisUtterance(res.data.message);
            window.speechSynthesis.speak(utterance);

        } catch (err) {
            console.error(err);
            const utterance = new SpeechSynthesisUtterance("Sorry, I had trouble processing that.");
            window.speechSynthesis.speak(utterance);
        }
        setIsProcessing(false);
        resetTranscript();
    };

    if (!browserSupportsSpeechRecognition) {
        return null; // Fallback or alert
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className={`
        relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300
        ${listening ? 'bg-red-500 scale-110' : 'bg-primary-600 hover:bg-primary-700'}
        ${isProcessing ? 'animate-pulse' : ''}
      `}>
                {/* Ripple Effect */}
                {listening && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}

                <button
                    onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
                    className="relative z-10 text-white p-4 focus:outline-none"
                >
                    {listening ? <MicOff size={28} /> : <Mic size={28} />}
                </button>
            </div>

            {/* Transcript Popup */}
            {(transcript || isProcessing) && (
                <div className="absolute bottom-20 right-0 w-64 p-4 glass-dark rounded-xl text-sm mb-2 transition-all">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase tracking-wider">
                        <Activity size={12} className={listening ? "animate-pulse text-green-400" : ""} />
                        {listening ? "Listening..." : isProcessing ? "Processing..." : "Heard"}
                    </div>
                    <p className="italic">"{transcript}"</p>
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
