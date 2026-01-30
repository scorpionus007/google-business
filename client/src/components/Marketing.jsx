import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Wand2, Share2, Image as ImageIcon } from 'lucide-react';

const Marketing = ({ lastAction }) => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [postType, setPostType] = useState('image_ad'); // Default to image

    // Handle Voice Actions
    useEffect(() => {
        if (lastAction) {
            if (lastAction.type === 'marketing_text') {
                setGeneratedContent({
                    text: lastAction.data.text,
                    html: lastAction.data.html,
                    imageUrl: null
                });
            } else if (lastAction.type === 'marketing_image') {
                setGeneratedContent({ imageUrl: lastAction.data, content: '' });
            }
        }
    }, [lastAction]);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await api.post('/marketing/generate', {
                topic,
                platform: 'Instagram',
                type: postType
            });
            setGeneratedContent(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
            {/* Input Section */}
            <div className="google-card p-8 flex flex-col justify-center">
                <div className="mb-8">
                    <h2 className="text-2xl font-normal text-[#202124] mb-2">
                        AI Marketing Studio
                    </h2>
                    <p className="text-[#5f6368]">Generate viral content for your business instantly.</p>
                </div>

                <div className="space-y-6">
                    {/* Type Selector */}
                    <div className="flex gap-2 p-1 bg-[#F1F3F4] rounded-lg w-fit">
                        <button
                            onClick={() => setPostType('image_ad')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${postType === 'image_ad' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-[#5f6368] hover:text-[#202124]'}`}
                        >
                            Image Ad
                        </button>
                        <button
                            onClick={() => setPostType('text_post')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${postType === 'text_post' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-[#5f6368] hover:text-[#202124]'}`}
                        >
                            Text Post
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f6368] mb-2">What do you want to promote?</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. 50% discount on summer collection, Festive offers for Diwali..."
                            className="google-input w-full h-32 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="google-btn w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Wand2 className="animate-spin" /> : <Wand2 />}
                        {loading ? 'Generating Magic...' : 'Generate Campaign'}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="google-card flex items-center justify-center p-8 relative overflow-hidden bg-[#F8F9FA]">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 blur-3xl rounded-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 blur-3xl rounded-full opacity-50"></div>

                {generatedContent ? (
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative z-10 animate-fade-in text-[#202124] flex flex-col h-[600px]">
                        {/* Header Actions */}
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const blob = new Blob([generatedContent.html], { type: 'text/html' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'ad-design.html';
                                        a.click();
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                                    title="Download HTML"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                            {generatedContent.html ? (
                                <iframe
                                    srcDoc={generatedContent.html}
                                    title="Ad Preview"
                                    className="w-full h-full border-none"
                                    style={{ minHeight: '400px' }}
                                />
                            ) : (
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                                    {generatedContent.imageUrl ? (
                                        <img src={generatedContent.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon size={48} className="text-gray-300" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Caption & Actions */}
                        <div className="p-5 border-t border-gray-100 bg-white">
                            <p className="text-sm text-[#3c4043] leading-relaxed mb-4 whitespace-pre-line max-h-24 overflow-y-auto">
                                {generatedContent.text || generatedContent.content}
                            </p>
                            <div className="flex gap-2">
                                <button onClick={() => alert("Successfully posted to Instagram! (Simulated)")} className="flex-1 py-2 bg-[#1a73e8] text-white rounded-lg text-sm font-medium hover:bg-[#1557b0] transition-colors shadow-sm">
                                    Post Now
                                </button>
                                <button
                                    onClick={async () => {
                                        const phone = prompt("Enter customer phone number (e.g. 15551234567):");
                                        if (phone) {
                                            await api.post('/whatsapp/send-promo', {
                                                phone,
                                                promoDetails: {
                                                    text: generatedContent.text || generatedContent.content,
                                                    imageUrl: generatedContent.imageUrl
                                                }
                                            });
                                            alert("Sent via WhatsApp!");
                                        }
                                    }}
                                    className="p-2 border border-[#dadce0] text-[#5f6368] rounded-lg hover:bg-[#f1f3f4] transition-colors"
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-sm">
                            <Wand2 size={32} className="text-[#1a73e8]" />
                        </div>
                        <h3 className="text-xl font-medium text-[#202124] mb-2">Ready to Create</h3>
                        <p className="text-[#5f6368] max-w-xs mx-auto">Use the panel on the left or ask the Voice Assistant to "Create an ad for Sale"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketing;
