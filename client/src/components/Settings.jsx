import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-2xl font-normal text-[#202124] mb-6">Settings</h2>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="google-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#1a73e8] rounded-full flex items-center justify-center text-2xl text-white font-medium">
                            {user?.businessName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[#202124]">{user?.businessName}</h3>
                            <p className="text-[#5f6368] text-sm">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#e6f4ea] text-[#137333] text-xs rounded-full border border-[#ceead6] font-medium">
                                {user?.category}
                            </span>
                        </div>
                    </div>
                </div>

                {/* App Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="google-card p-6 hover:shadow-md cursor-pointer transition-shadow" onClick={() => alert("Notification settings coming soon!")}>
                        <Bell className="text-[#1a73e8] mb-3" />
                        <h4 className="font-medium text-[#202124]">Notifications</h4>
                        <p className="text-sm text-[#5f6368]">Manage alerts and sounds</p>
                    </div>
                    <div className="google-card p-6 hover:shadow-md cursor-pointer transition-shadow" onClick={() => alert("Security settings coming soon!")}>
                        <Shield className="text-[#9334e6] mb-3" />
                        <h4 className="font-medium text-[#202124]">Security</h4>
                        <p className="text-sm text-[#5f6368]">Password and 2FA</p>
                    </div>
                </div>

                {/* Logout */}
                <div className="mt-8 pt-6 border-t border-[#dadce0]">
                    <button
                        onClick={handleLogout}
                        className="w-full md:w-auto px-8 py-3 bg-[#fce8e6] hover:bg-[#fad2cf] text-[#c5221f] rounded-full flex items-center justify-center gap-2 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
