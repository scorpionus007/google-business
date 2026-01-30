import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, MessageCircle, CheckCircle, AlertTriangle, Send, RefreshCw } from 'lucide-react';

const GoogleBusiness = () => {
    const [audit, setAudit] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false); // Start false to show input
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [businessName, setBusinessName] = useState('');
    const [businessUrl, setBusinessUrl] = useState('');
    const [hasAudited, setHasAudited] = useState(false);

    useEffect(() => {
        // Only fetch reviews initially, wait for input for audit
        // fetchData(); 
    }, []);

    const handleRunAudit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const [auditRes, reviewsRes] = await Promise.all([
                api.get('/google/audit', { params: { name: businessName, url: businessUrl } }),
                api.get('/google/reviews')
            ]);
            setAudit(auditRes.data);
            setReviews(reviewsRes.data);
            setHasAudited(true);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleGenerateReply = async (review) => {
        setIsGenerating(true);
        try {
            const res = await api.post('/google/reviews/generate-reply', {
                reviewText: review.comment,
                rating: review.rating
            });
            setReplyText(res.data.reply);
        } catch (err) {
            console.error(err);
        }
        setIsGenerating(false);
    };

    const handleSendReply = async (reviewId) => {
        try {
            await api.post(`/google/reviews/${reviewId}/reply`, { replyText });
            setReplyingTo(null);
            setReplyText('');
            alert('Reply posted successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-normal text-[#202124] mb-6">Google Business Profile Audit</h2>

            {!hasAudited ? (
                <div className="google-card p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-normal text-[#202124] mb-4">Add Your Business</h3>
                    <form onSubmit={handleRunAudit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#5f6368] mb-1">Business Name</label>
                            <input
                                type="text"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="google-input w-full"
                                placeholder="e.g. Joe's Pizza"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#5f6368] mb-1">Google Maps Link (Optional)</label>
                            <input
                                type="url"
                                value={businessUrl}
                                onChange={(e) => setBusinessUrl(e.target.value)}
                                className="google-input w-full"
                                placeholder="https://maps.google.com/..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="google-btn w-full flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                            Run Smart Audit
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    {loading && <div className="text-center text-[#5f6368]">Analyzing Profile...</div>}

                    {/* Audit Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div className="google-card p-6 relative overflow-hidden bg-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full"></div>
                            <h3 className="text-lg font-medium text-[#5f6368] mb-2">Profile Health</h3>
                            <div className="flex items-end gap-2 relative z-10">
                                <span className="text-5xl font-normal text-[#202124]">{audit?.score}%</span>
                                <span className={`text-sm mb-2 px-2 py-1 rounded-full ${audit?.health === 'Good' || audit?.health === 'Excellent' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fef7e0] text-[#b06000]'}`}>
                                    {audit?.health}
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2 google-card p-6">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-lg font-medium text-[#5f6368]">Optimization Suggestions</h3>
                                <button onClick={() => setHasAudited(false)} className="text-xs text-[#1a73e8] hover:text-[#174ea6] font-medium">New Audit</button>
                            </div>
                            <div className="space-y-3">
                                {audit?.suggestions.map((sugg, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[#3c4043]">
                                        <AlertTriangle size={18} className="text-[#f9ab00]" />
                                        <span>{sugg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="google-card p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-normal text-[#202124]">Recent Reviews</h3>
                            <div className="text-[#5f6368] text-sm">{audit?.reviewsPending} pending replies</div>
                        </div>

                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-[#dadce0] pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium text-[#202124]">{review.user}</div>
                                            <div className="flex text-[#fbbc04] text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-[#dadce0]"} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-xs text-[#5f6368]">{review.date}</div>
                                    </div>

                                    <p className="text-[#3c4043] mb-4">"{review.comment}"</p>

                                    {review.reply ? (
                                        <div className="bg-[#f8f9fa] p-4 rounded-xl ml-4 border-l-2 border-[#1e8e3e]">
                                            <div className="text-[#137333] text-xs font-bold mb-1">YOUR REPLY</div>
                                            <p className="text-[#5f6368] text-sm">{review.reply}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {replyingTo === review.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="google-input w-full"
                                                        rows="3"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Write your reply..."
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleGenerateReply(review)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-[#f3e8fd] text-[#9334e6] hover:bg-[#e9d5fc] rounded-full text-sm font-medium transition-colors"
                                                            disabled={isGenerating}
                                                        >
                                                            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                                                            Auto-Generate
                                                        </button>
                                                        <div className="flex-1"></div>
                                                        <button
                                                            onClick={() => setReplyingTo(null)}
                                                            className="px-4 py-2 text-[#5f6368] hover:text-[#202124] text-sm font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSendReply(review.id)}
                                                            className="flex items-center gap-2 px-6 py-2 bg-[#1a73e8] text-white rounded-full text-sm font-medium hover:bg-[#1557b0] transition-colors"
                                                        >
                                                            <Send size={16} /> Send Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                                                    className="text-[#1a73e8] hover:text-[#174ea6] text-sm font-medium flex items-center gap-1"
                                                >
                                                    <MessageCircle size={16} /> Reply to review
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GoogleBusiness;
