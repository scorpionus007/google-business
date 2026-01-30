import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Receipt, Megaphone, Settings, CreditCard, Globe, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Categories that don't need inventory
    const SERVICE_CATEGORIES = ["Hospital / Clinic", "Pathology Lab", "Tuition / Coaching", "Real Estate Agency", "Automobile Garage", "Salon / Spa", "Gym / Fitness"];
    const showInventory = user && !SERVICE_CATEGORIES.includes(user.category);

    const links = [
        { to: "/", icon: LayoutDashboard, label: "Overview" },
        ...(showInventory ? [{ to: "/inventory", icon: ShoppingBag, label: "Inventory" }] : []),
        { to: "/sales", icon: CreditCard, label: "Sales & Transactions" },
        { to: "/billing", icon: Receipt, label: "Billing" },
        { to: "/marketing", icon: Megaphone, label: "Marketing AI" },
        { to: "/google-business", icon: LayoutDashboard, label: "Google Business" },
        { to: "/website-builder", icon: Globe, label: "Website Builder" },
        { to: "/learn", icon: BookOpen, label: "Learning Hub" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <aside className="w-64 bg-white h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex flex-col border-r border-[#dadce0] z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white font-bold">B</div>
                <h1 className="text-xl font-medium text-[#202124]">
                    BizBox
                </h1>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `
              flex items-center gap-4 px-6 py-3 rounded-r-full mr-4 transition-colors duration-200
              ${isActive
                                ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                                : 'text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]'}
            `}
                    >
                        <link.icon size={20} />
                        <span className="text-sm">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[#dadce0] space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-3 text-[#5f6368] hover:bg-[#fce8e6] hover:text-[#d93025] rounded-r-full mr-4 transition-colors duration-200"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f1f3f4] cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-sm font-medium">
                        {user?.businessName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#202124] truncate max-w-[140px]">{user?.businessName || 'My Business'}</p>
                        <p className="text-xs text-[#5f6368]">{user?.email || 'Manage Account'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
