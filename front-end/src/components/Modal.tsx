import React from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 animate-fade-up">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-6">
              {children ? (
                children
              ) : (
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  {type && (
                    <div className="relative mb-6">
                      <div className={`absolute -inset-2 rounded-full blur opacity-25 ${
                        type === 'success' ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 
                        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                        'bg-gradient-to-r from-primary-500 to-secondary-500'
                      }`}></div>
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                        type === 'success' ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 
                        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                        'bg-gradient-to-r from-primary-500 to-secondary-500'
                      } text-white`}>
                        {type === 'success' ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : type === 'error' ? (
                          <XCircle className="w-8 h-8" />
                        ) : (
                          <Info className="w-8 h-8" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  {title && (
                    <h3 className={`text-xl font-bold mb-3 ${
                      type === 'success' ? 'text-accent-600' : 
                      type === 'error' ? 'text-red-600' : 
                      'text-primary-600'
                    }`}>
                      {title}
                    </h3>
                  )}

                  {/* Message */}
                  {message && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {message}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    onClick={onButtonClick || onClose}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      type === 'success' 
                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg hover:shadow-accent-500/25' 
                        : type === 'error' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25' 
                          : 'btn-gradient-primary'
                    }`}
                  >
                    {buttonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
