import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
            const res = await api.post('/auth/register', formData);
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] py-10">
            <div className="bg-white p-10 rounded-2xl w-full max-w-md border border-[#dadce0] shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-normal text-[#202124]">
                        Create your BizBox Account
                    </h2>
                    <p className="text-[#5f6368] mt-2">Start automating your business today</p>
                </div>

                {error && <div className="bg-[#fce8e6] text-[#c5221f] text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" required
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            placeholder="Username"
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                        <input
                            type="password" required
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            placeholder="Password"
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <input type="text" required
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            placeholder="Business Name"
                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#5f6368] mb-1 ml-1">Business Category</label>
                        <select
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <p className="text-xs text-[#5f6368] mt-1 ml-1">We'll customize the app for your {formData.category}.</p>
                    </div>

                    <button type="submit" className="google-btn w-full justify-center mt-4">
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <span className="text-sm text-[#5f6368]">Already have an account? </span>
                    <Link to="/login" className="text-sm text-[#1a73e8] hover:text-[#174ea6] font-medium">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
