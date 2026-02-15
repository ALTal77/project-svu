
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface ReportData {
  id: number;
  postTitle: string;
  reason: string;
  reporterName: string;
  createdAt: string;
}

export const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/reports');
      setReports(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Fetch reports error:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredReports = reports.filter(report => {
    const searchTarget = (report.postTitle || '').toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Report Management</h2>
        
        <div className="relative w-full md:w-96 text-sm">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#721E94] focus:border-transparent outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#721E94] mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchReports}
              className="px-4 py-2 bg-[#721E94] text-white rounded-lg hover:bg-[#5d187a] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchQuery ? `No reports found matching "${searchQuery}"` : 'No reports available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Post Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-gray-900">{report.postTitle || 'Deleted Post'}</p>
                    </td>
                    <td className="px-6 py-5 text-gray-600 text-xs max-w-xs truncate">
                      <p className="">{report.id}</p>
                    </td>
                   
                    <td className="px-6 py-5 text-gray-600 text-xs max-w-xs truncate">
                      {report.reason}
                    </td>
                    <td className="px-6 py-5 text-gray-600 text-xs font-medium">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
