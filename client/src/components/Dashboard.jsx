import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import api from '../services/api';

const Dashboard = ({ lastAction }) => {
    const [stats, setStats] = useState({
        totalSales: 12500,
        orders: 45,
        products: 0,
        customers: 12
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats({
                    totalSales: res.data.sales.total,
                    orders: res.data.inventory.lowStock,
                    products: res.data.inventory.count,
                    customers: res.data.customers.total
                });
            } catch (e) { console.error(e); }
        }
        fetchStats();
    }, [lastAction]);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="google-card p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${color}-50 text-${color}-600`}>
                    <Icon size={24} />
                </div>
                <span className="text-xs text-[#5f6368] font-medium bg-green-50 px-2 py-1 rounded-full text-green-700">+12%</span>
            </div>
            <h3 className="text-3xl font-normal text-[#202124] mb-1">{value}</h3>
            <p className="text-[#5f6368] text-sm">{label}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalSales}`} color="green" />
                <StatCard icon={ShoppingCart} label="Pending Orders" value={stats.orders} color="blue" />
                <StatCard icon={TrendingUp} label="Total Products" value={stats.products} color="purple" />
                <StatCard icon={Users} label="Total Customers" value={stats.customers} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 google-card p-6">
                    <h3 className="text-lg font-medium text-[#202124] mb-4">Recent Voice Activity</h3>
                    <div className="space-y-2">
                        {lastAction ? (
                            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#dadce0] flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-[#1a73e8] uppercase font-bold tracking-wider">{lastAction.intent}</span>
                                    <p className="text-[#3c4043] mt-1">{lastAction.message}</p>
                                </div>
                                <span className="text-xs text-[#5f6368]">Just now</span>
                            </div>
                        ) : (
                            <p className="text-[#5f6368] italic">No voice commands yet...</p>
                        )}
                    </div>
                </div>

                <div className="google-card p-6">
                    <h3 className="text-lg font-medium text-[#202124] mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full p-3 rounded-lg hover:bg-[#F8F9FA] text-[#1a73e8] font-medium transition-colors text-left flex items-center gap-3">
                            <span className="bg-[#e8f0fe] p-2 rounded-full"><ShoppingCart size={18} /></span>
                            Add Product
                        </button>
                        <button className="w-full p-3 rounded-lg hover:bg-[#F8F9FA] text-[#1a73e8] font-medium transition-colors text-left flex items-center gap-3">
                            <span className="bg-[#e8f0fe] p-2 rounded-full"><TrendingUp size={18} /></span>
                            Create Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
