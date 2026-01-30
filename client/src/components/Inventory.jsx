import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBusinessConfig } from '../config/BusinessConfig';

const Inventory = ({ lastAction }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const config = getBusinessConfig(user?.category);

    useEffect(() => {
        fetchProducts();
    }, [lastAction]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/inventory');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuickAdd = async (itemName) => {
        const category = config.categories[0];
        try {
            await api.post('/inventory', {
                name: itemName,
                category: category,
                price: 0,
                stock: 10
            });
            fetchProducts();
        } catch (e) { console.error(e); }
    }

    const handleManualAdd = async () => {
        const name = prompt("Enter product name:");
        if (!name) return;
        const price = prompt("Enter price (₹):", "100");
        const stock = prompt("Enter stock quantity:", "10");

        try {
            await api.post('/inventory', {
                name,
                category: config.categories[0], // Default to first category
                price: parseFloat(price) || 0,
                stock: parseInt(stock) || 0
            });
            fetchProducts();
        } catch (e) {
            console.error(e);
            alert("Failed to add product.");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-normal text-[#202124]">{config.labels.inventory}</h2>
                    <p className="text-[#5f6368] text-sm">Manage your {config.labels.item.toLowerCase()}s and {config.labels.stock.toLowerCase()}</p>
                </div>
                <button
                    onClick={handleManualAdd}
                    className="google-btn flex items-center gap-2"
                >
                    <Plus size={18} /> {config.labels.addBtn}
                </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {config.categories.map(cat => (
                    <button key={cat} onClick={() => setSearchTerm(cat)} className="google-chip bg-white hover:bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]">
                        {cat}
                    </button>
                ))}
                <button onClick={() => setSearchTerm('')} className="google-chip bg-[#e8f0fe] text-[#1a73e8] border-transparent">
                    All Categories
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${config.labels.item.toLowerCase()}s...`}
                    className="google-input w-full pl-12"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="google-card overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="h-48 bg-[#f8f9fa] relative overflow-hidden flex items-center justify-center">
                            {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <Package size={48} className="text-[#dadce0]" />
                            )}
                            <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-medium text-[#3c4043] border border-[#dadce0] shadow-sm">
                                {p.category}
                            </span>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-medium text-[#202124] mb-1">{p.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <p className="text-xs text-[#5f6368]">Price</p>
                                    <p className="text-lg font-medium text-[#202124]">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#5f6368]">{config.labels.stock}</p>
                                    <p className={`text-lg font-medium ${p.stock < 10 ? 'text-[#d93025]' : 'text-[#188038]'}`}>
                                        {p.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-[#f1f3f4] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-[#dadce0]" />
                    </div>
                    <p className="text-[#5f6368]">No {config.labels.item.toLowerCase()}s found.</p>
                    {products.length === 0 && (
                        <>
                            <p className="text-sm text-gray-500 mt-4 mb-4">Quick Add Recommended Items:</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {config.defaultItems.map(item => (
                                    <button key={item} onClick={() => handleQuickAdd(item)} className="px-4 py-2 bg-white hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] rounded-full text-sm font-medium transition-colors shadow-sm">
                                        + Add {item}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;
