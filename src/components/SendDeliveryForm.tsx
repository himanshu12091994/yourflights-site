import React, { useState, useEffect } from 'react';
import { Send, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PDF_TEMPLATES } from '../data/pdfTemplates';

interface SendDeliveryFormProps {
  authToken: string;
}

export const SendDeliveryForm: React.FC<SendDeliveryFormProps> = ({ authToken }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [inclusions, setInclusions] = useState('');
  const [terms, setTerms] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch available orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders for delivery form", err);
      }
    };
    fetchOrders();
  }, [authToken]);

  // When template changes, auto-fill the inclusions and terms
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);
    
    if (templateKey && PDF_TEMPLATES[templateKey]) {
      setInclusions(PDF_TEMPLATES[templateKey].inclusions);
      setTerms(PDF_TEMPLATES[templateKey].terms);
    } else {
      setInclusions('');
      setTerms('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsProcessing(true);
    
    if (!selectedOrderId || !inclusions || !terms) {
      setError('Please fill in all fields (Order, Template).');
      setIsProcessing(false);
      return;
    }
    
    try {
      const response = await fetch('/api/admin/deliveries/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          orderId: selectedOrderId,
          clientEmail: customerEmail,
          inclusions,
          terms
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch delivery package.');
      }
      
      setSuccess(`Success! ${data.message || 'Delivery dispatched.'}`);
      // Reset form on success
      setSelectedOrderId('');
      setSelectedTemplate('');
      setInclusions('');
      setTerms('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto h-full">
      <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4 h-full flex flex-col">
        <label className="block text-sm font-bold text-slate-900 mb-2 border-b border-slate-200 pb-2">
          Dispatch Order Delivery Package
        </label>
        
        <p className="text-xs text-slate-500 mb-4">
          Select an order and a template to automatically generate and email the PDF delivery package to the client.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Select Order / Client</label>
          <select
            required
            value={selectedOrderId}
            onChange={(e) => {
              const orderId = e.target.value;
              setSelectedOrderId(orderId);
              const order = orders.find(o => o.id === orderId);
              if (order) {
                setCustomerEmail(order.customerEmail || '');
              } else {
                setCustomerEmail('');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 cursor-pointer appearance-none text-sm"
          >
            <option value="">-- Choose an Order --</option>
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                {order.customerName} ({order.id}) - {order.status}
              </option>
            ))}
          </select>
        </div>

        {selectedOrderId && (
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Customer Email (Editable for Dispatch)</label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 outline-none focus:border-blue-500 text-sm"
              placeholder="client@example.com"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Package Template</label>
          <select
            required
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 cursor-pointer appearance-none text-sm"
          >
            <option value="">-- Choose a Template --</option>
            {Object.keys(PDF_TEMPLATES).map(key => (
              <option key={key} value={key}>
                {PDF_TEMPLATES[key].name}
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div className="flex-1 space-y-3 mt-2 border-t border-slate-200 pt-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Inclusions (Editable)</label>
              <textarea
                value={inclusions}
                onChange={(e) => setInclusions(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-xs outline-none focus:border-blue-500 h-24 font-mono resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Terms (Editable)</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-xs outline-none focus:border-blue-500 h-16 font-mono resize-none"
                required
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex gap-2 items-center">
             <AlertCircle className="h-4 w-4 shrink-0" />
             <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 flex gap-2 items-center">
             <CheckCircle2 className="h-4 w-4 shrink-0" />
             <span>{success}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3.5 rounded-xl text-sm shadow-md shadow-blue-900/50 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        {isProcessing ? <Send className="h-4 w-4 animate-pulse" /> : <FileText className="h-4 w-4" />}
        <span>{isProcessing ? 'Generating & Sending...' : 'Dispatch Delivery Package'}</span>
      </button>
    </form>
  );
};
