import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Code, Download, ExternalLink, RefreshCw, Send, Globe } from 'lucide-react';

const WebsiteBuilder = ({ lastAction }) => {
    const [description, setDescription] = useState('');
    const [htmlCode, setHtmlCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lastAction && lastAction.intent === 'BUILD_WEBSITE') {
            if (lastAction.entities && lastAction.entities.description) {
                setDescription(lastAction.entities.description);
                // Optional: Auto-trigger generation? Let's just fill it for now to let user confirm.
            }
        }
    }, [lastAction]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/website/generate', { description });
            setHtmlCode(res.data.html);
        } catch (err) {
            console.error(err);
            alert("Failed to generate website.");
        }
        setLoading(false);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([htmlCode], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = "my_business_website.html";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-normal text-[#202124] flex items-center gap-3">
                        <Globe className="text-[#1a73e8]" /> AI Website Builder
                    </h2>
                    <p className="text-[#5f6368] text-sm mt-1">Describe your business, and I'll code a website for you.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 h-full min-h-0">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="google-card p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-medium text-[#202124] mb-4">Your Vision</h3>
                        <textarea
                            className="google-input w-full resize-none flex-1 text-[#202124]"
                            placeholder="Type or speak: 'I run a cozy coffee shop called Java Joy. We sell espresso, pastries, and have free wifi. I want a warm, brown color theme with a menu section...'"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !description}
                            className="mt-4 google-btn w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <RefreshCw className="animate-spin" /> : <Code />}
                            Generate Website Code
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="google-card overflow-hidden flex flex-col h-[600px] lg:h-auto border border-[#dadce0] bg-white relative">
                    {htmlCode ? (
                        <>
                            <div className="bg-[#f1f3f4] p-2 flex justify-between items-center px-4 border-b border-[#dadce0]">
                                <span className="text-xs text-[#5f6368] font-medium">Preview Mode</span>
                                <button onClick={handleDownload} className="text-xs flex items-center gap-1 text-[#188038] hover:text-[#137333] font-medium">
                                    <Download size={14} /> Download HTML
                                </button>
                            </div>
                            <div className="bg-[#e8f0fe] border-b border-[#dadce0] p-3 text-xs text-[#1a73e8] flex items-start gap-2">
                                <ExternalLink size={14} className="mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold">How to publish this website?</span>
                                    <p className="mt-1 opacity-80 text-[#3c4043]">
                                        1. Download the HTML file.<br />
                                        2. Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="underline hover:text-[#1a73e8]">Netlify Drop</a>.<br />
                                        3. Drag & drop the downloaded file there. Your site will be live in seconds!
                                    </p>
                                </div>
                            </div>
                            <iframe
                                srcDoc={htmlCode}
                                className="w-full h-full border-none bg-white"
                                title="Website Preview"
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[#dadce0]">
                            <Code size={48} className="mb-4 opacity-50" />
                            <p className="text-[#5f6368]">Your generated website preview will appear here.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                            <RefreshCw size={48} className="text-[#1a73e8] animate-spin mb-4" />
                            <p className="text-[#202124] font-medium">Coding your website...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebsiteBuilder;
