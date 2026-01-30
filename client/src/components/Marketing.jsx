import React, { useState } from 'react';
import axios from 'axios';
import { Wand2, Share2, Image as ImageIcon } from 'lucide-react';

const Marketing = ({ lastAction }) => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/marketing/generate', {
                topic,
                platform: 'Instagram',
                type: 'Offer'
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
            <div className="glass-dark p-8 rounded-2xl border border-white/5 flex flex-col justify-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                        AI Marketing Studio
                    </h2>
                    <p className="text-gray-400">Generate viral content for your business instantly.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">What do you want to promote?</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. 50% discount on summer collection, Festive offers for Diwali..."
                            className="w-full h-32 bg-slate-800 border-none rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading ? <Wand2 className="animate-spin" /> : <Wand2 />}
                        {loading ? 'Generating Magic...' : 'Generate Campaign'}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-slate-800 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>

                {generatedContent ? (
                    <div className="max-w-sm w-full bg-white rounded-xl shadow-2xl overflow-hidden relative z-10 animate-fade-in text-slate-900">
                        <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                            {generatedContent.imageUrl ? (
                                <img src={generatedContent.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={48} className="text-gray-400" />
                            )}
                            <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">Instagram Post</span>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                                {generatedContent.content}
                            </p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Post Now</button>
                                <button className="p-2 border border-blue-100 rounded-lg text-blue-600 hover:bg-blue-50"><Share2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Wand2 size={32} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Create</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">Use the panel on the left or ask the Voice Assistant to "Create an ad for Sale"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketing;
