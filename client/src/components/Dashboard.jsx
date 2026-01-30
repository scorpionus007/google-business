import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ lastAction }) => {
    const [stats, setStats] = useState({
        totalSales: 12500,
        orders: 45,
        products: 0,
        customers: 12
    });

    useEffect(() => {
        // Fetch real stats if API available
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/inventory');
                setStats(prev => ({ ...prev, products: res.data.length }));
            } catch (e) {
                console.error(e);
            }
        }
        fetchStats();
    }, [lastAction]);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
                    <Icon size={24} />
                </div>
                <span className="text-xs text-gray-500 font-mono">+12% vs last week</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-400 text-sm">{label}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalSales}`} color="green" />
                <StatCard icon={ShoppingCart} label="Pending Orders" value={stats.orders} color="blue" />
                <StatCard icon={TrendingUp} label="Total Products" value={stats.products} color="purple" />
                <StatCard icon={Users} label="Total Customers" value={stats.customers} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-dark p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">Recent Voice Activity</h3>
                    <div className="space-y-4">
                        {lastAction ? (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-blue-400 uppercase font-bold tracking-wider">{lastAction.intent}</span>
                                    <p className="text-white mt-1">{lastAction.message}</p>
                                </div>
                                <span className="text-xs text-gray-500">Just now</span>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No voice commands yet...</p>
                        )}
                    </div>
                </div>

                <div className="glass-dark p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 className="text-xl font-bold mb-4 relative z-10">Quick Actions</h3>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all shadow-lg shadow-blue-500/20 text-left flex items-center gap-3">
                            <span className="bg-white/20 p-2 rounded-lg"><ShoppingCart size={16} /></span>
                            Add Product
                        </button>
                        <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all text-left flex items-center gap-3">
                            <span className="bg-white/10 p-2 rounded-lg"><TrendingUp size={16} /></span>
                            Create Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
