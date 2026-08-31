import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, RefreshCw, AlertCircle } from 'lucide-react';
import { PayuCheckoutForm } from './PayuCheckoutForm';
import { SendDeliveryForm } from './SendDeliveryForm';

export const AdminDashboardPage: React.FC<{ onOpenSEOAudit?: () => void }> = ({ onOpenSEOAudit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && data.error === 'First time login requires password change') {
          setShowPasswordChangeModal(true);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      sessionStorage.setItem('adminToken', data.token);
      setAuthToken(data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (newPasswordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match');
      return;
    }
    if (newPasswordInput.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordInput, newPassword: newPasswordInput })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');

      setShowPasswordChangeModal(false);
      handleLogin(new Event('submit') as unknown as React.FormEvent);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setAuthToken(null);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    if (showPasswordChangeModal) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50"></div>
          <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center relative z-10">
            <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-amber-600/30">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-black text-slate-900">First Time Login</h1>
            <p className="text-xs text-amber-700 mt-1 mb-6">For security purposes, you must change your master password before accessing the portal.</p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative text-left">
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
              <div className="relative text-left">
                <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2 text-left">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isChangingPassword ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Set Password & Login</span>}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50"></div>
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center relative z-10">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-600/30">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Payment Portal</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">Staff Secure Login</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative text-left">
              <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Staff Password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoginLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Unlock Portal</span>}
            </button>
          </form>
          <p className="text-[10px] text-slate-600 mt-6 font-mono">Secure Access Only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 pointer-events-none"></div>
      
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg">Payment Portal</h1>
            <p className="text-[10px] text-emerald-600 font-mono">Virtual Terminal</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 transition"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 flex flex-col items-start justify-center p-6 gap-6 z-10 w-full max-w-6xl mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <PayuCheckoutForm authToken={authToken!} />
          </div>
          <div className="w-full md:w-1/2">
            <SendDeliveryForm authToken={authToken!} />
          </div>
        </div>

      </main>
    </div>
  );
};

// ShieldCheck component for login screen if not defined above
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
