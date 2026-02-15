import React from 'react';
import { CheckCircle2, X, Loader2 } from 'lucide-react';

interface UnbanConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isLoading?: boolean;
}

const UnbanConfirmModal: React.FC<UnbanConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <CheckCircle2 className="text-green-500 relative z-10" size={40} />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Unban</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              Are you sure you want to restore access for this user <span className="font-semibold text-gray-700">{userName}</span>? 
            </p>
          </div>

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
              className="flex-1 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Unbanning...
                </>
              ) : (
                'Unban User'
              )}
            </button>
          </div>
        </div>

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

export default UnbanConfirmModal;
