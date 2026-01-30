import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';

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

                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 py-2 bg-slate-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 text-sm">
                            <Printer size={16} /> Print
                        </button>
                        <button className="flex-1 py-2 border border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 text-sm">
                            <Download size={16} /> Download PDF
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
