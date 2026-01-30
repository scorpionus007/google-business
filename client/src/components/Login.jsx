import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
            <div className="bg-white p-10 rounded-2xl w-full max-w-md border border-[#dadce0] shadow-sm">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">B</div>
                    <h2 className="text-2xl font-normal text-[#202124]">
                        Sign in to BizBox
                    </h2>
                    <p className="text-[#5f6368] mt-2">Manage your business with AI</p>
                </div>

                {error && <div className="bg-[#fce8e6] text-[#c5221f] text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="google-input w-full border border-[#dadce0] bg-white focus:border-[#1a73e8] focus:ring-0"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Password"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-[#1a73e8] hover:text-[#174ea6] font-medium">Forgot password?</Link>
                    </div>

                    <button type="submit" className="google-btn w-full justify-center">
                        Next
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/register" className="text-sm text-[#1a73e8] hover:text-[#174ea6] font-medium">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
