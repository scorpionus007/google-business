import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import api from '../services/api';

const Billing = ({ lastAction }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] glass-dark rounded-2xl border border-white/5 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                <FileText size={48} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Voice Billing System</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
                "Say 'Prepare a bill for 2 Paracetamols' to automatically generate an invoice."
            </p>

            {lastAction && lastAction.intent === 'CREATE_BILL' ? (
                <div className="w-full max-w-md bg-white text-slate-900 rounded-xl p-6 text-left shadow-2xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="font-bold text-lg">Invoice #INV-2024-001</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">PAID</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {lastAction.entities?.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{item.name} x {item.qty}</span>
                                <span className="font-bold">₹{item.price * item.qty}</span>
                            </div>
                        )) || <p className="text-gray-500 italic">Processing items...</p>}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 font-bold text-lg">
                        <span>Total</span>
                        <span>₹{lastAction.entities?.total || '0.00'}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button onClick={() => window.print()} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
                        <button onClick={() => alert("Downloading PDF... (Check console for mock data)")} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2"><Download size={16} /> Download PDF</button>
                        <button
                            onClick={async () => {
                                const phone = prompt("Enter customer phone:");
                                if (phone) {
                                    try {
                                        await api.post('/whatsapp/send-bill', {
                                            phone,
                                            billDetails: { customerName: "Valued Customer", amount: lastAction.entities?.total || 0 }
                                        });
                                        alert("Bill sent to WhatsApp!");
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to send bill.");
                                    }
                                }
                            }}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            WhatsApp
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 border border-dashed border-white/10 rounded-xl w-full max-w-md bg-white/5">
                    <p className="text-gray-500 text-sm">Waiting for voice command...</p>
                </div>
            )}
        </div>
    );
};

export default Billing;
