import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CreditCard, Calendar, ArrowUpRight, Search, FileText } from 'lucide-react';

const Sales = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await api.get('/billing');
            setBills(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const filteredBills = bills.filter(b =>
        b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toString().includes(searchTerm)
    );

    const totalRevenue = bills.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-normal text-[#202124]">Sales & Transactions</h2>
                    <p className="text-[#5f6368] text-sm">Track your revenue and invoices.</p>
                </div>
                <div className="bg-[#e6f4ea] border border-[#ceead6] px-6 py-3 rounded-xl">
                    <p className="text-xs text-[#137333] uppercase font-bold tracking-wider">Total Revenue</p>
                    <p className="text-2xl font-normal text-[#202124]">₹{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer name or ID..."
                    className="google-input w-full pl-12"
                />
            </div>

            {/* Table */}
            <div className="google-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8f9fa] text-[#5f6368] text-sm font-medium">
                        <tr>
                            <th className="p-4 font-medium">Invoice ID</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Items</th>
                            <th className="p-4 font-medium">Total</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dadce0]">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-[#5f6368]">Loading sales data...</td></tr>
                        ) : filteredBills.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-[#5f6368]">No sales recorded yet.</td></tr>
                        ) : (
                            filteredBills.map(bill => (
                                <tr key={bill.id} className="hover:bg-[#f1f3f4] transition-colors">
                                    <td className="p-4 text-[#202124] font-medium">#INV-{bill.id}</td>
                                    <td className="p-4 text-[#5f6368] text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(bill.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#3c4043]">{bill.customerName}</td>
                                    <td className="p-4 text-[#5f6368] text-sm">
                                        {bill.items?.length || 0} items
                                    </td>
                                    <td className="p-4 text-[#202124] font-medium">₹{bill.totalAmount}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333]">
                                            Paid
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
