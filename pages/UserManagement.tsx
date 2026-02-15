import React, { useState, useEffect } from 'react';
import { Search, Ban, Eye, Loader2, Phone, MapPin, Wallet } from 'lucide-react';
import { api } from '../services/api';
import BanConfirmModal from '../components/BanConfirmModal';
import UnbanConfirmModal from '../components/UnbanConfirmModal';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  city: string;
  balance: number;
  isBanned: boolean;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [banModal, setBanModal] = useState<{ isOpen: boolean; user: UserData | null }>({
    isOpen: false,
    user: null
  });
  const [unbanModal, setUnbanModal] = useState<{ isOpen: boolean; user: UserData | null }>({
    isOpen: false,
    user: null
  });

  const fetchUsers = async (city: string = 'All Cities') => {
    const cityParam = typeof city === 'string' ? city : selectedCity;
    
    setLoading(true);
    setError('');
    try {
      let endpoint = '/User/all';
      if (cityParam !== 'All Cities') {
        endpoint = `/User/city/${cityParam}`;
      }
      const data = await api.get(endpoint);
      
      const mappedData = (Array.isArray(data) ? data : []).map((u: any) => {
        const isBanned = u.isBanned || u.banned || u.status === 'Banned' || u.status === 1 || false;
        return {
          ...u,
          id: u.id || u.userId || u.idUser || u.email, 
          isBanned: isBanned,
          fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown User'
        };
      });
      
      setUsers(mappedData);
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (user: UserData) => {
    setProcessingId(user.id);
    
    try {
      if (user.isBanned) {
        await api.post(`/unban?userid=${user.id}`, "");
      } else {
        // Ban API - removed double /api/ prefix
        await api.post(`/User/ban?userid=${user.id}`, "");
      }
      
      // Refresh list after success
      await fetchUsers(selectedCity);
      setBanModal({ isOpen: false, user: null });
      setUnbanModal({ isOpen: false, user: null });
      
    } catch (err: any) {
      console.error('Ban/Unban toggle error:', err);
      const errorMsg = (err.message || '').toLowerCase();
      
      if (errorMsg.includes('already') || errorMsg.includes('not')) {
        await fetchUsers(selectedCity);
        setBanModal({ isOpen: false, user: null });
        setUnbanModal({ isOpen: false, user: null });
        return;
      }
      
      alert(user.isBanned ? `Failed to unban: ${err.message}` : `Failed to ban: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchUsers(selectedCity);
  }, [selectedCity]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const cities = ['All Cities', 'Aleppo', 'Damascus', 'Homs', 'Lattakia', 'Tartous', 'Hama', 'Idlib', 'Daraa', 'Deir ez-Zor'];

  const getInitials = (first: string, last: string) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
  };

  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-indigo-100 text-indigo-600',
    'bg-orange-100 text-orange-600',
    'bg-green-100 text-green-600',
    'bg-pink-100 text-pink-600'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative text-sm">
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="appearance-none w-full sm:w-48 pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#721E94] focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative w-full md:w-80 text-sm">
            <input
              type="text"
              placeholder="Search by name or email..."
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
            <p className="text-gray-500 font-medium">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={() => fetchUsers(selectedCity)}
              className="px-4 py-2 bg-[#721E94] text-white rounded-lg hover:bg-[#5d187a] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchQuery ? `No users found matching "${searchQuery}"` : 'No users available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">User Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Contact & Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Balance</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${colors[idx % colors.length]}`}>
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.isBanned && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                              Banned
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {user.phoneNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {user.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-50 p-2 rounded-lg">
                          <Wallet size={16} className="text-green-600" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          ${user.balance.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        {user.isBanned ? (
                          <button 
                            onClick={() => setUnbanModal({ isOpen: true, user })}
                            disabled={processingId === user.id}
                            className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all ${processingId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                            title="Unban User"
                          >
                            {processingId === user.id ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        ) : (
                          <>
                            <button 
                            onClick={() => setUnbanModal({ isOpen: true, user })}
                            disabled={processingId === user.id}
                            className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all ${processingId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                            title="Unban User"
                          >
                            {processingId === user.id ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                            <button 
                              onClick={() => setBanModal({ isOpen: true, user })}
                              disabled={processingId === user.id}
                              className={`p-2 rounded-lg transition-all text-red-400 hover:text-red-600 hover:bg-red-50 ${processingId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                              title="Ban User"
                            >
                              {processingId === user.id ? (
                                <Loader2 className="animate-spin" size={20} />
                              ) : (
                                <Ban size={20} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BanConfirmModal
        isOpen={banModal.isOpen}
        onClose={() => setBanModal({ isOpen: false, user: null })}
        onConfirm={() => banModal.user && handleBanToggle(banModal.user)}
        userName={banModal.user?.fullName || ''}
        isLoading={processingId !== null}
      />

      <UnbanConfirmModal
        isOpen={unbanModal.isOpen}
        onClose={() => setUnbanModal({ isOpen: false, user: null })}
        onConfirm={() => unbanModal.user && handleBanToggle(unbanModal.user)}
        userName={unbanModal.user?.fullName || ''}
        isLoading={processingId !== null}
      />
    </div>
  );
};