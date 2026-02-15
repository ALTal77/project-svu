import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
              <AlertTriangle className="text-red-500 relative z-10" size={40} />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{title}"</span>? 
              This action is permanent and cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-[#721E94] hover:bg-[#5d187a] text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </button>
          </div>
        </div>

        {/* Close button */}
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

export default DeleteConfirmModal;
