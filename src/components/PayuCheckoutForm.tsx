import React, { useState, useEffect } from 'react';
import { RefreshCw, CreditCard, CheckCircle2, Globe, Home, User } from 'lucide-react';

interface PayuCheckoutFormProps {
  authToken: string;
}

export const PayuCheckoutForm: React.FC<PayuCheckoutFormProps> = ({ authToken }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [error, setError] = useState('');

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
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, [authToken]);

  // Listen for iframe success/failure messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'PAYU_SUCCESS') {
        setShowIframe(false);
        setIsProcessing(false);
        setAmount('');
        alert('Payment processed successfully!');
      } else if (event.data === 'PAYU_FAILURE') {
        setShowIframe(false);
        setIsProcessing(false);
        setError('Payment was declined or cancelled. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // 0. Update order details if an order was selected and details were modified
      if (selectedOrderId) {
        await fetch(`/api/admin/orders/${selectedOrderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            customerName,
            customerEmail,
            customerPhone,
            finalAmount: numAmount
          }),
        });
      }

      // 1. Get Payment Hash from backend
      const response = await fetch('/api/admin/create-payu-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount: numAmount,
          customerName,
          customerEmail,
          customerPhone: customerPhone || '9999999999',
          productinfo: 'Flight Services'
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize PayU order');
      }

      // 2. Launch Checkout - Create a dynamic form and submit
      const payuUrl = data.environment === 'PRODUCTION' 
        ? 'https://secure.payu.in/_payment' 
        : 'https://test.payu.in/_payment';

      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', payuUrl);

      form.setAttribute('target', 'payu_iframe');

      const params: Record<string, string> = {
        key: data.key,
        txnid: data.txnid,
        amount: numAmount.toString(),
        productinfo: 'Flight Services',
        firstname: customerName,
        email: customerEmail,
        phone: customerPhone || '9999999999',
        surl: `${window.location.origin}/api/webhooks/payu/success`,
        furl: `${window.location.origin}/api/webhooks/payu/failure`,
        hash: data.hash,
        pg: 'CC', // Enforce Credit Card tab by default
        drop_category: 'NB,EMI,CASH,UPI,WALLET', // Hide non-card options
        enforce_paymethod: 'creditcard|debitcard',
      };

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      setShowIframe(true);
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col relative">
      
      {/* Fixed Full-Screen Overlay for Iframe */}
      <div className={`z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm transition-all duration-300 ${showIframe ? 'fixed inset-0 opacity-100 visible' : 'fixed inset-0 opacity-0 invisible pointer-events-none'}`}>
        <div className={`w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 transform transition-all duration-300 delay-100 ${showIframe ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
            <h3 className="text-white font-bold text-sm sm:text-base">Secure Bank Authorization</h3>
            <button 
              type="button"
              onClick={() => { setShowIframe(false); setIsProcessing(false); }}
              className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs font-bold"
            >
              Cancel / Close
            </button>
          </div>
          <iframe 
            name="payu_iframe" 
            id="payu_iframe" 
            className="w-full flex-1 border-0 bg-white" 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 h-full">
        <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4 h-full flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Process Card Payment (PayU)
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Select Order (Auto-fills details)</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              value={selectedOrderId}
              onChange={(e) => {
                const orderId = e.target.value;
                setSelectedOrderId(orderId);
                const order = orders.find(o => o.id === orderId);
                if (order) {
                  setCustomerName(order.customerName || '');
                  setCustomerEmail(order.customerEmail || '');
                  setCustomerPhone(order.customerPhone || '');
                  setAmount(order.remainingAmount ? order.remainingAmount.toString() : order.finalAmount.toString());
                } else {
                  setCustomerName('');
                  setCustomerEmail('');
                  setCustomerPhone('');
                  setAmount('');
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-slate-900 outline-none focus:border-emerald-500 cursor-pointer appearance-none text-sm"
            >
              <option value="">-- Manual Entry --</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.customerName} - {order.status} (${order.finalAmount})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 text-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 font-mono text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Customer Email</label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 text-sm"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Customer Phone</label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 text-sm"
              placeholder="9999999999"
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-500 mt-2 flex items-center">
          <CreditCard className="h-3 w-3 mr-1" />
          PCI-DSS Compliant. Payments processed securely by PayU.
        </p>

        {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</div>}
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-sm shadow-md shadow-emerald-900/50 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        <span>{isProcessing ? 'Processing securely...' : 'Pay Securely'}</span>
      </button>
    </form>
  </div>
  );
};

