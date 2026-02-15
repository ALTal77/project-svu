
import React, { useState, useEffect } from 'react';
import { Trash2, Search, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

interface PostData {
  id: number;
  title: string;
  mediaUrls: string[];
  createdAt: string;
  categoryName: string;
  city: string;
}

export const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Drafts'>('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostData | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/posts/all');
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Fetch posts error:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (post: PostData) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    setDeletingId(postToDelete.id);
    try {
      await api.delete(`/posts/${postToDelete.id}`);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id));
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error('Delete post error:', err);
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
      setPostToDelete(null);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'All'; 
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Post Management</h2>
        
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

      <div className="border-b border-gray-200 mb-6">
        <div className="flex items-center space-x-8">
          {(['All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-3 border-b-2 font-medium transition-all flex items-center space-x-2 ${
                activeTab === tab 
                  ? 'border-[#721E94] text-[#721E94] font-bold' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab} Posts</span>
              {tab === 'All' && !loading && (
                <span className="bg-[#721E94] text-white px-2 py-0.5 rounded text-xs">{posts.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#721E94] mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchPosts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchQuery ? `No posts found matching "${searchQuery}"` : 'No posts available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Media</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Post Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">City</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">  
                      <img 
                        src={post.mediaUrls && post.mediaUrls.length > 0 ? api.getUri(post.mediaUrls[0]) : 'https://via.placeholder.com/100x100?text=No+Image'} 
                        className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                        alt="" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Error';
                        }}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-md">
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#FE8031] transition-colors cursor-pointer ">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {new Date(post.createdAt).toLocaleDateString()} 
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-600">{post.city || 'Not specified'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 ">
                      <span className="px-3 py-1 rounded-full bg-[#FE8031] text-white text-[10px] font-bold tracking-wider uppercase">
                        {post.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2 ml-2">
                        <button 
                          onClick={() => openDeleteModal(post)}
                          disabled={deletingId === post.id}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title={postToDelete?.title || ''}
          isLoading={deletingId !== null}
        />
      </div>
    </div>
  );
};
