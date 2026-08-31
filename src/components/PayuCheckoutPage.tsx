import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';

export const PayuCheckoutPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // URL Params
  const [amount, setAmount] = useState<number>(0);
  const [serviceName, setServiceName] = useState('');
  const [orderId, setOrderId] = useState('');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get('amount') || params.get('order_amount');
    const srv = params.get('service');
    const oid = params.get('orderId');

    if (amt) setAmount(parseFloat(amt));
    if (srv) setServiceName(srv);
    if (oid) setOrderId(oid);
    
    const err = params.get('error');
    if (err === 'payment_failed') {
      setError('Previous payment attempt failed. Please try again with a valid card.');
    }
  }, []);

  // Listen for iframe success/failure messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'PAYU_SUCCESS') {
        setShowIframe(false);
        setIsProcessing(false);
        // Redirect to success page
        window.location.href = `/?success=true&auditId=${orderId}`;
      } else if (event.data === 'PAYU_FAILURE') {
        setShowIframe(false);
        setIsProcessing(false);
        setError('Payment was declined or cancelled. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      if (amount <= 0) {
        throw new Error('Invalid amount specified.');
      }

      // We'll call the public hash generator endpoint
      // If orderId exists, we can pass it, else it generates a generic one
      const response = await fetch('/api/create-public-payu-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName,
          customerEmail,
          customerPhone: customerPhone || '9999999999',
          productinfo: serviceName || `Order ${orderId || 'Payment'}`,
          auditId: orderId
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      const payuUrl = data.environment === 'PRODUCTION' 
        ? 'https://secure.payu.in/_payment' 
        : 'https://test.payu.in/_payment';

      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', payuUrl);

      form.setAttribute('target', 'payu_iframe');

      // We prefix txnid with our orderId if we have one so webhook can process it
      const finalTxnId = orderId ? `txn_${orderId}_${data.txnid.split('_')[2]}` : data.txnid;

      const params: Record<string, string> = {
        key: data.key,
        txnid: finalTxnId,
        amount: amount.toString(),
        productinfo: serviceName || `Order ${orderId || 'Payment'}`,
        firstname: customerName,
        email: customerEmail,
        phone: customerPhone || '9999999999',
        surl: `${window.location.origin}/api/webhooks/payu/success`,
        furl: `${window.location.origin}/api/webhooks/payu/failure`,
        hash: data.hash,
        pg: 'CC',
        drop_category: 'NB,EMI,CASH,UPI,WALLET',
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className={`w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col transition-all duration-300 ${showIframe ? 'max-w-3xl h-[90vh]' : 'max-w-xl'}`}>
        <div className="bg-slate-900 p-6 sm:p-8 text-center border-b border-emerald-500/30 shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Secure Card Checkout</h1>
          <p className="text-sm text-slate-400">Complete your payment for {serviceName || 'Your Flights Services'}</p>
          <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-mono text-emerald-400 font-bold tracking-tight">
            ${amount.toFixed(2)} USD
          </div>
        </div>

        <iframe 
          name="payu_iframe" 
          id="payu_iframe" 
          className={`w-full flex-1 border-0 bg-white ${showIframe ? 'block' : 'hidden'}`} 
        />
        
        {showIframe && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button 
              onClick={() => { setShowIframe(false); setIsProcessing(false); }}
              className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
            >
              Cancel Payment / Go Back
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`p-8 space-y-6 ${showIframe ? 'hidden' : 'block'}`}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-200 flex items-center gap-2">
              <div className="font-bold">Error:</div> {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Billing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-xl shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all group"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Processing Securely...</span>
              </>
            ) : (
              <>
                <span>Pay ${amount.toFixed(2)} USD Securely</span>
                <ShieldCheck className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-[11px] text-slate-400">
              Payments are securely processed by PayU. Your card details are never stored on our servers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
