import React from 'react';
import { Ban, X, Loader2, CheckCircle2 } from 'lucide-react';

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type: 'ban' | 'unban';
  isLoading?: boolean;
}

const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText,
  type,
  isLoading 
}) => {
  if (!isOpen) return null;

  const isBan = type === 'ban';

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
            <div className={`w-20 h-20 ${isBan ? 'bg-red-50' : 'bg-green-50'} rounded-full flex items-center justify-center relative`}>
              <div className={`absolute inset-0 ${isBan ? 'bg-red-100' : 'bg-green-100'} rounded-full animate-ping opacity-20`} />
              {isBan ? (
                <Ban className="text-red-500 relative z-10" size={40} />
              ) : (
                <CheckCircle2 className="text-green-500 relative z-10" size={40} />
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              {message}
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
              className={`flex-1 px-6 py-3.5 ${isBan ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-green-500 hover:bg-green-600 shadow-green-100'} text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
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

export default ActionConfirmModal;
