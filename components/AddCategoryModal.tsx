import React, { useState } from 'react';
import { X, Plus, Loader2, Tags } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}) => {
  const [categoryName, setCategoryName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    await onConfirm(categoryName);
    setCategoryName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <Plus className="text-green-500 relative z-10" size={40} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Add New Category</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              Enter the name for the new category.  
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                required
              />
              <Tags className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !categoryName.trim()}
              className="flex-1 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>

        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all disabled:opacity-0"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
