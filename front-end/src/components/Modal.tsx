import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  buttonText = 'Đóng',
  onButtonClick,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-6">
          {children ? (
            children
          ) : (
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              {type && (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${type === 'success' ? 'bg-green-100' : type === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}
                >
                  {type === 'success' ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : type === 'error' ? (
                    <XCircle className="w-8 h-8 text-red-500" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      {/* Placeholder for info icon */}
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              {title && (
                <h3 className={`text-xl font-semibold mb-2
                  ${type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {title}
                </h3>
              )}

              {/* Message */}
              {message && (
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
              )}

              {/* Button */}
              <button
                onClick={onButtonClick || onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors
                  ${type === 'success' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : type === 'error' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
