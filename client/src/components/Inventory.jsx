import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBusinessConfig } from '../config/BusinessConfig';

const Inventory = ({ lastAction }) => {
    const [products, setProducts] = useState([]);
    const { user } = useAuth();
    const config = getBusinessConfig(user?.category);

    useEffect(() => {
        fetchProducts();
    }, [lastAction]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuickAdd = async (itemName) => {
        const category = config.categories[0];
        try {
            await axios.post('http://localhost:5000/api/inventory', {
                name: itemName,
                category: category,
                price: 0,
                stock: 10
            });
            fetchProducts();
        } catch (e) { console.error(e); }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{config.labels.inventory}</h2>
                    <p className="text-gray-400 text-sm">Manage your {config.labels.item.toLowerCase()}s and {config.labels.stock.toLowerCase()}</p>
                </div>
                <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                    <Plus size={18} /> {config.labels.addBtn}
                </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {config.categories.map(cat => (
                    <button key={cat} className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-gray-300 hover:border-primary-500 hover:text-white whitespace-nowrap transition-all">
                        {cat}
                    </button>
                ))}
                <button className="px-4 py-1.5 rounded-full border border-dashed border-slate-600 text-sm text-gray-500 hover:text-white hover:border-slate-400 flex items-center gap-1">
                    <Plus size={14} /> New Category
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder={`Search ${config.labels.item.toLowerCase()}s...`}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder-gray-500"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="glass-dark group rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-300">
                        <div className="h-48 bg-slate-800 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                            {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600"><Package size={48} /></div>
                            )}
                            <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10">
                                {p.category}
                            </span>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{p.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <p className="text-xs text-gray-500">Price/Cost</p>
                                    <p className="text-lg font-bold text-white">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{config.labels.stock}</p>
                                    <p className={`text-lg font-bold ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                        {p.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-slate-600" />
                    </div>
                    <p className="text-gray-400">No {config.labels.item.toLowerCase()}s found.</p>
                    <p className="text-sm text-gray-500 mt-4 mb-4">Quick Add Recommended Items:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {config.defaultItems.map(item => (
                            <button key={item} onClick={() => handleQuickAdd(item)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700">
                                + Add {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
