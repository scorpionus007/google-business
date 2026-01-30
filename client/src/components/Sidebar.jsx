import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Receipt, Megaphone, Settings } from 'lucide-react';

const Sidebar = () => {
    const links = [
        { to: "/", icon: LayoutDashboard, label: "Overview" },
        { to: "/inventory", icon: ShoppingBag, label: "Inventory" },
        { to: "/billing", icon: Receipt, label: "Billing" },
        { to: "/marketing", icon: Megaphone, label: "Marketing AI" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <aside className="w-64 glass-dark h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex flex-col border-r border-slate-800">
            <div className="p-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    BizBox AI
                </h1>
                <p className="text-xs text-gray-400 mt-1">MSME Automation</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-primary-600/20 text-blue-400 border border-blue-500/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                    <div>
                        <p className="text-sm font-semibold text-white">My Business</p>
                        <p className="text-xs text-gray-400">Manage Account</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
