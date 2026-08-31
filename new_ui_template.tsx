  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl z-10 flex flex-col relative"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-white tracking-tight leading-tight">Your Flights</h2>
            <p className="text-[10px] text-blue-400 font-mono tracking-wider">COMMAND CENTER</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('orders'); setSelectedOrderId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeTab === 'orders' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Inbox className="h-4 w-4" />
            Orders & Deals
            <span className="ml-auto bg-slate-800 text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('payments'); setSelectedOrderId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeTab === 'payments' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(5,150,105,0.1)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Payments Ledger
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            Secure Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {activeTab === 'orders' && !selectedOrder && 'Orders & Deals'}
            {activeTab === 'orders' && selectedOrder && `Order Details #${selectedOrder.id}`}
            {activeTab === 'payments' && 'Payments Ledger'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData()}
              disabled={isLoading}
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Global Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
                toast.type === 'success' ? 'bg-emerald-500/80 border-emerald-400/50 shadow-emerald-500/20' : 'bg-rose-500/80 border-rose-400/50 shadow-rose-500/20'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{toast.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* View: Orders List */}
            {activeTab === 'orders' && !selectedOrder && (
              <motion.div
                key="orders-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search orders, clients, emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Filter className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-11 pr-10 py-3 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Statuses</option>
                        {Object.keys(STATUS_PILLS).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Order
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 text-sm">
                      <Inbox className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      No orders found matching your criteria.
                    </div>
                  ) : (
                    filteredOrders.map((order, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className="group bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-slate-800/60 backdrop-blur-sm"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <p className="text-[10px] font-mono text-slate-500 mb-1">#{order.orderRef}</p>
                            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{order.customerName}</h3>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${STATUS_PILLS[order.status]?.bg || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                            {STATUS_PILLS[order.status]?.label || order.status}
                          </span>
                        </div>
                        <div className="space-y-3 mb-5 text-xs">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Service:</span>
                            <span className="text-slate-200 line-clamp-1 max-w-[140px] text-right" title={order.serviceName}>{order.serviceName}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Total Value:</span>
                            <span className="text-slate-200 font-mono font-bold">${order.finalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${order.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`} 
                            style={{ width: `${order.finalAmount > 0 ? (order.amountPaid / order.finalAmount) * 100 : 0}%` }}
                          />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* View: Order Detail */}
            {activeTab === 'orders' && selectedOrder && (
              <motion.div
                key="order-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto space-y-6 pb-20"
              >
                <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className={`text-xs font-bold border rounded-xl px-4 py-2 outline-none cursor-pointer appearance-none ${STATUS_PILLS[selectedOrder.status]?.bg || 'bg-slate-800 text-slate-200 border-slate-700'}`}
                    >
                      {Object.keys(STATUS_PILLS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Customer & Payment */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 backdrop-blur-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <User className="h-4 w-4" />
                          </div>
                          <h2 className="text-lg font-bold text-white">Client Information</h2>
                        </div>
                        <button
                          onClick={() => {
                            if (!isEditingCustomer) {
                              setEditName(selectedOrder.customerName);
                              setEditEmail(selectedOrder.customerEmail);
                              setEditPhone(selectedOrder.customerPhone || '');
                              setEditNotes(selectedOrder.internalNotes || '');
                            }
                            setIsEditingCustomer(!isEditingCustomer);
                          }}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          {isEditingCustomer ? 'Cancel' : 'Edit Details'}
                        </button>
                      </div>

                      {isEditingCustomer ? (
                        <div className="space-y-4 relative z-10">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="block text-slate-400 mb-1">Full Name</label>
                              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Email Address</label>
                              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Phone Number</label>
                              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Internal Notes</label>
                              <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                          </div>
                          <button onClick={handleSaveCustomerInfo} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition">Save Client Details</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                          <div>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Client Name</span>
                            <p className="text-sm font-bold text-white mt-1">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Email Address</span>
                            <p className="text-sm text-slate-300 font-mono mt-1">{selectedOrder.customerEmail}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Phone</span>
                            <p className="text-sm text-slate-300 font-mono mt-1">{selectedOrder.customerPhone || '—'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Order Date</span>
                            <p className="text-sm text-slate-300 mt-1">{new Date(selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Service Scope</span>
                            <p className="text-sm font-medium text-white mt-1 bg-slate-950/50 border border-slate-800 p-4 rounded-xl">{selectedOrder.serviceName}</p>
                            {selectedOrder.internalNotes && (
                              <p className="mt-3 text-xs text-amber-200/80 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl italic">
                                Note: {selectedOrder.internalNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment & Invoicing Card */}
                    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 backdrop-blur-md relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <h2 className="text-lg font-bold text-white">Payment & Invoicing</h2>
                        </div>
                        <button
                          onClick={() => {
                            if (!isEditingPayment) {
                              setEditFinalAmount(selectedOrder.finalAmount);
                              setEditAmountPaid(selectedOrder.amountPaid);
                              setEditPaymentStatus(selectedOrder.paymentStatus);
                            }
                            setIsEditingPayment(!isEditingPayment);
                          }}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          {isEditingPayment ? 'Cancel' : 'Adjust Ledgers'}
                        </button>
                      </div>

                      {isEditingPayment ? (
                        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 relative z-10">
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <label className="block text-slate-400 mb-1">Final Invoice Amount ($)</label>
                              <input type="number" step="0.01" value={editFinalAmount} onChange={(e) => setEditFinalAmount(parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500 font-mono" />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Amount Paid ($)</label>
                              <input type="number" step="0.01" value={editAmountPaid} onChange={(e) => setEditAmountPaid(parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500 font-mono" />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Payment Status</label>
                              <select value={editPaymentStatus} onChange={(e) => setEditPaymentStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                                <option value="Unpaid">Unpaid</option>
                                <option value="Partial">Partial</option>
                                <option value="Paid">Paid</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </div>
                          </div>
                          <button onClick={handleSavePaymentInfo} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">Save Adjustments</button>
                        </div>
                      ) : (
                        <div className="flex gap-10 relative z-10 items-center">
                          <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 w-32 h-32 rounded-3xl shadow-inner">
                            <span className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Value</span>
                            <span className="text-3xl font-mono font-bold text-white">${selectedOrder.finalAmount}</span>
                          </div>
                          <div className="flex-1 space-y-4 text-sm">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-slate-400">Amount Paid</span>
                              <span className="text-emerald-400 font-mono font-bold">${selectedOrder.amountPaid.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-slate-400">Remaining Balance</span>
                              <span className="text-rose-400 font-mono font-bold">${selectedOrder.remainingAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-slate-400">Status</span>
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                selectedOrder.paymentStatus === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}>
                                {selectedOrder.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cashfree Virtual Terminal Drop-in */}
                      <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
                        {selectedOrder.remainingAmount > 0 ? (
                           <CashfreeCheckoutForm
                             amount={selectedOrder.remainingAmount}
                             customerName={selectedOrder.customerName}
                             customerEmail={selectedOrder.customerEmail}
                             customerPhone={selectedOrder.customerPhone}
                             authToken={authToken!}
                             onSuccess={() => { showToast('Payment Processed Successfully!'); fetchData(); }}
                             onError={(err) => showToast(`Payment Error: ${err}`, 'error')}
                           />
                        ) : (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-3">
                              <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-emerald-400 font-bold mb-1">Invoice Fully Paid</h3>
                            <p className="text-xs text-emerald-400/70">No further payments required for this order.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Communication & Compliance */}
                  <div className="space-y-6">
                    {/* Compliance Box */}
                    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="h-4 w-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-white">Compliance & Auth</h3>
                      </div>
                      {orderAck ? (
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                            <CheckCircle2 className="h-4 w-4" /> Signed by Client
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">IP Address</span>
                            <span className="font-mono text-slate-300">{orderAck.clientIp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Timestamp</span>
                            <span className="text-slate-300 text-right">{new Date(orderAck.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="pt-3 border-t border-slate-800">
                            <span className="text-slate-500 block mb-1">Device Profile</span>
                            <span className="text-[10px] text-slate-400 leading-tight block">{orderAck.userAgent}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200/80 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                          <p>Client has not yet acknowledged the service agreement and MCC compliance terms.</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-4">
                        <SendHorizontal className="h-4 w-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">Dispatch Hub</h3>
                      </div>
                      <div className="space-y-2">
                        <button
                          disabled={isSendingEmail}
                          onClick={() => handleSendEmailAction('payment_link')}
                          className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition group disabled:opacity-50"
                        >
                          <span className="flex items-center gap-2">
                            <LinkIcon className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                            Send Payment Link
                          </span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                        <button
                          disabled={isSendingEmail}
                          onClick={() => handleSendEmailAction('order_confirmation')}
                          className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition group disabled:opacity-50"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                            Resend Confirmation Receipt
                          </span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View: Payments */}
            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                 <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 backdrop-blur-md">
                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                     <CreditCard className="h-5 w-5 text-emerald-400" />
                     <h2 className="text-lg font-bold text-white">Recent Gateway Transactions</h2>
                   </div>
                   
                   {payments.length === 0 ? (
                     <div className="text-center py-12 text-slate-500 text-sm">
                       No payments recorded yet.
                     </div>
                   ) : (
                     <div className="overflow-x-auto">
                       <table className="w-full text-left text-xs">
                         <thead className="text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-800">
                           <tr>
                             <th className="px-4 py-3 font-medium">Txn ID</th>
                             <th className="px-4 py-3 font-medium">Order Ref</th>
                             <th className="px-4 py-3 font-medium text-right">Amount</th>
                             <th className="px-4 py-3 font-medium text-center">Status</th>
                             <th className="px-4 py-3 font-medium">Provider</th>
                             <th className="px-4 py-3 font-medium">Timestamp</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                           {payments.map(p => (
                             <tr key={p.id} className="hover:bg-slate-800/30 transition">
                               <td className="px-4 py-4 font-mono text-slate-400">{p.id.substring(0,8)}...</td>
                               <td className="px-4 py-4 font-bold text-blue-400 cursor-pointer" onClick={() => { setActiveTab('orders'); setSelectedOrderId(p.orderId); }}>
                                 {orders.find(o => o.id === p.orderId)?.orderRef || p.orderId.substring(0,6)}
                               </td>
                               <td className="px-4 py-4 font-mono font-bold text-slate-200 text-right">${p.amount.toFixed(2)}</td>
                               <td className="px-4 py-4 text-center">
                                 <span className={`px-2 py-1 rounded-md border text-[10px] ${p.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                   {p.status}
                                 </span>
                               </td>
                               <td className="px-4 py-4 uppercase text-[10px] font-bold text-slate-400">{p.provider}</td>
                               <td className="px-4 py-4 text-slate-500">{new Date(p.createdTime).toLocaleString()}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Modals & Overlays would go here (Create Order Modal, etc.) 
          Keeping them minimal for brevity in script injection but retaining the state. */}
          
      {/* Create Order Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-blue-400" />
                  Create Manual Order
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Client Full Name</label>
                  <input required type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Client Email</label>
                  <input required type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Amount (USD)</label>
                    <input required type="number" value={newAmount} onChange={e => setNewAmount(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Phone (Optional)</label>
                    <input type="text" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Internal Notes</label>
                  <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" rows={3}></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-xl transition shadow-lg shadow-blue-600/20">
                    Draft Order & Generate Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
