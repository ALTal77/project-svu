
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Search, Filter, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface TransactionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
}

interface TransactionData {
  id: number;
  transactionNumber: string;
  amount: number;
  status: number;
  users: TransactionUser;
  imagePath?: string;
}

export const RechargeManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionData | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      // Only 'pending' has a specific endpoint, others use the main endpoint and filter client-side
      const endpoint = filter === 'pending' 
        ? '/balance/admin/transactions/pending' 
        : '/balance/admin/transactions';
      const response = await api.get(endpoint);
         
         // Robust data extraction: look for an array in response, response.data, or any object property
         let data = [];
         if (Array.isArray(response)) {
           data = response;
         } else if (response && typeof response === 'object') {
           if (Array.isArray(response.data)) {
             data = response.data;
           } else {
             // Search for the first property that is an array (e.g., 'transactions', 'results', etc.)
             const firstArrayKey = Object.keys(response).find(key => Array.isArray(response[key]));
             data = firstArrayKey ? response[firstArrayKey] : [];
           }
         }
         
         setTransactions(data);
       } catch (err: any) {
      console.error('Fetch transactions error:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
     if (!selectedTx || !rechargeAmount) return;
     
     setIsProcessing(true);
     try {
       await api.post(`/balance/admin/approve/${selectedTx.id}`, {
         amount: Number(rechargeAmount)
       });
       setIsModalOpen(false);
       setSelectedTx(null);
       setRechargeAmount('');
       fetchTransactions();
     } catch (err: any) {
      console.error('Approve error:', err);
      alert(err.message || 'Failed to approve recharge');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTx) return;
    
    setIsProcessing(true);
    try {
      await api.post(`/balance/admin/reject/${selectedTx.id}`, {});
      setIsRejectModalOpen(false);
      setSelectedTx(null);
      fetchTransactions();
    } catch (err: any) {
      console.error('Reject error:', err);
      alert(err.message || 'Failed to reject recharge');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const filteredTransactions = transactions.filter(tx => {
    const user = tx.users || { firstName: '', lastName: '', email: '' };
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const search = searchQuery.toLowerCase();
    
    const matchesSearch = fullName.includes(search) || 
           user.email.toLowerCase().includes(search) ||
           tx.transactionNumber.toLowerCase().includes(search);

    if (!matchesSearch) return false;

    // Additional client-side filtering based on selected status
    if (filter === 'accepted') return tx.status === 2;
    if (filter === 'rejected') return tx.status === 3;
    if (filter === 'pending') return tx.status === 0 || tx.status === 1;

    return true;
  });

  const getStatusDisplay = (status: number, amount: number) => {
    // Priority rule: status = 1 and amount = 0 means Pending
    if (status === 1 && amount === 0) {
      return { label: 'Pending', color: 'bg-orange-500', text: 'text-orange-600' };
    }

    switch (status) {
      case 0:
        return { label: 'Pending', color: 'bg-orange-500', text: 'text-orange-600' };
      case 1:
        return { label: 'Pending', color: 'bg-orange-500', text: 'text-orange-600' };
      case 2:
        return { label: 'Accepted', color: 'bg-emerald-500', text: 'text-emerald-600' };
      case 3:
        return { label: 'Rejected', color: 'bg-red-500', text: 'text-red-600' };
      default:
        return { label: 'Unknown', color: 'bg-gray-500', text: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Recharge Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative text-sm">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'rejected')}
              className="appearance-none w-full sm:w-48 pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#721E94] focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
            >
              <option value="all">All Transactions</option>
              <option value="pending">Pending Only</option>
              <option value="accepted">Accepted Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative w-full md:w-80 text-sm">
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#721E94] focus:border-transparent outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#721E94] mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <p className="text-red-500 font-medium text-center mb-4">{error}</p>
            <button 
              onClick={fetchTransactions}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            {searchQuery ? `No transactions found matching "${searchQuery}"` : 'No transactions found'}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-auto py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 pr-14 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((tx) => {
                const status = getStatusDisplay(tx.status, tx.amount);
                const user = tx.users || { firstName: 'Unknown', lastName: 'User', email: 'N/A' };
                
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        
                        <div>
                          <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-gray-400" title={tx.transactionNumber}>
                        {tx.transactionNumber.split('-')[0]}  
                      </p>
                    </td>
                   
                    <td className="px-6 py-5">
                      {tx.imagePath ? (
                        <a href={api.getUri(tx.imagePath)} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={api.getUri(tx.imagePath)} 
                            alt="Receipt" 
                            className="h-10 w-10 object-cover rounded hover:scale-150 transition-transform cursor-pointer border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                            }}
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No receipt</span>
                      )}
                    </td>

                    <td className={`px-6 py-5 font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount.toLocaleString()} SYP
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${status.color}`}></div>
                        <span className={`text-xs font-bold ${status.text} uppercase tracking-wider`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-14 text-right">
                      {(status.label === 'Pending') && (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group relative"
                            title="Approve Recharge"
                          >
                            <CheckCircle2 size={20} />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Approve
                            </span>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsRejectModalOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                            title="Reject Recharge"
                          >
                            <X size={20} />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Reject
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Recharge Modal */}
      {isModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Approve Recharge</h3>
                  <p className="text-sm text-emerald-600 font-medium">Add balance to user account</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {selectedTx.imagePath && (
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <a href={api.getUri(selectedTx.imagePath)} target="_blank" rel="noopener noreferrer" className="block relative group">
                    <img 
                      src={api.getUri(selectedTx.imagePath)} 
                      alt="Receipt Preview" 
                      className="w-full h-48 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-opacity">View Full Size</span>
                    </div>
                  </a>
                  <div className="bg-gray-50 p-2 text-center text-xs text-gray-500 font-medium border-t border-gray-100">
                    Transaction Receipt
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">User</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedTx.users?.firstName} {selectedTx.users?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 font-medium">Transaction ID</span>
                  <span className="text-sm font-bold text-gray-400">#{selectedTx.transactionNumber}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Recharge Amount ($)</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="Enter amount to add..."
                    className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-lg text-emerald-600 placeholder:text-gray-300 group-hover:border-gray-200"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    USD
                  </div>
                </div>
                <p className="text-xs text-gray-400 ml-1">The specified amount will be added to the user's current balance.</p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing || !rechargeAmount}
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Confirm Approval</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reject Recharge</h3>
                  <p className="text-sm text-red-600 font-medium">Decline this request</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 font-medium">User</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedTx.users?.firstName} {selectedTx.users?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 font-medium">Transaction ID</span>
                  <span className="text-sm font-bold text-gray-400">#{selectedTx.transactionNumber}</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-gray-600">Are you sure you want to <span className="text-red-600 font-bold">reject</span> this recharge request?</p>
                <p className="text-xs text-gray-400">This action cannot be undone and the user will not receive any balance.</p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-red-200 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <X size={20} />
                      <span>Confirm Reject</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
