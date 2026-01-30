import React from 'react';
import { PlayCircle, Award, BookOpen } from 'lucide-react';

const Learn = () => {
    // Curated videos for MSMEs
    const videos = [
        { id: "1", title: "The 5 BEST Marketing Strategies For 2024", url: "https://www.youtube.com/embed/ZSNjaXPQEzg", category: "Marketing" },
        { id: "2", title: "How to Manage Small Business Inventory", url: "https://www.youtube.com/embed/eR5SE683e4k", category: "Operations" },
        { id: "3", title: "WhatsApp Business Full Course (Hindi)", url: "https://www.youtube.com/embed/lfimIMurMv4", category: "Tools" },
        { id: "4", title: "How to Manage Small Business Finances", url: "https://www.youtube.com/embed/h75oLMydZg8", category: "Finance" },
        { id: "5", title: "Sales Training Basics for Beginners", url: "https://www.youtube.com/embed/d_d-yWp2bGA", category: "Sales" },
        { id: "6", title: "Google Business Profile Set Up 2025", url: "https://www.youtube.com/embed/KPfjzL9oPiE", category: "Growth" },
    ];

    const handleClaim = () => {
        alert("🎉 Congratulations! You have claimed your 'Digital Business Master' badge. Check your profile settings.");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-normal text-[#202124] mb-2 flex items-center gap-3">
                <BookOpen className="text-[#fbbc04]" /> Learning Hub
            </h2>
            <p className="text-[#5f6368] mb-8">Master business skills with these curated resources.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                    <div key={video.id} className="google-card overflow-hidden group hover:shadow-md transition-all">
                        <div className="aspect-video bg-black relative">
                            <iframe
                                src={video.url}
                                title={video.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-4">
                            <span className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider mb-1 block">{video.category}</span>
                            <h3 className="text-lg font-medium text-[#202124] group-hover:text-[#174ea6] transition-colors">{video.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-[#e8f0fe] to-[#fce8e6] p-8 rounded-2xl border border-[#dadce0] flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-medium text-[#202124] mb-2">Claim Your Certificate</h3>
                    <p className="text-[#5f6368] max-w-lg">Complete 5 modules to earn a "Digital Business Master" badge for your profile.</p>
                </div>
                <button
                    onClick={handleClaim}
                    className="px-6 py-3 bg-[#fbbc04] hover:bg-[#f9ab00] text-[#202124] font-medium rounded-full flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Award size={20} /> Claim Now
                </button>
            </div>
        </div>
    );
};

export default Learn;
