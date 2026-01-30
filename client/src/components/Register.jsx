import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
    "Restaurant", "Hotel", "Hospital / Clinic", "Pathology Lab", "Retail Shop (General)",
    "Grocery Store", "Clothing / Boutique", "Tuition / Coaching", "Salon / Spa",
    "Pharmacy", "Gym / Fitness", "Electronics Store", "Automobile Garage",
    "Real Estate Agency", "Bakery / Cafe", "Jewelry Store", "Hardware Store"
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', businessName: '', category: CATEGORIES[0]
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-10">
            <div className="glass-dark p-8 rounded-2xl w-full max-w-md border border-white/10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
                    Start Your Automation
                </h2>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input type="text" required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input type="password" required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Business Name</label>
                        <input type="text" required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">We will customize the app for your {formData.category}.</p>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-bold transition-all mt-4">
                        Create Account
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4 text-sm">
                    Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
