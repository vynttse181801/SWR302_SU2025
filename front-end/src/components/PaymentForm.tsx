import React, { useState } from 'react';
import { CreditCard, Wallet, Building, CheckCircle, Lock, Shield } from 'lucide-react';
import { paymentService } from '../services/api';

interface PaymentFormProps {
  amount: number;
  bookingType: 'appointment' | 'test';
  bookingId: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentCancel: () => void;
}

interface PaymentData {
  method: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  bankCode?: string;
  accountNumber?: string;
  insuranceNumber?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  bookingType,
  bookingId,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const paymentMethods = [
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: Building,
      description: 'Internet Banking, Mobile Banking'
    },
    {
      id: 'insurance',
      name: 'Bảo hiểm y tế',
      icon: Shield,
      description: 'Thanh toán qua bảo hiểm'
    }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Số thẻ phải có 16 chữ số';
      }
      if (!paymentData.cardHolder) {
        newErrors.cardHolder = 'Tên chủ thẻ là bắt buộc';
      }
      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Ngày hết hạn là bắt buộc';
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        newErrors.cvv = 'CVV phải có 3-4 chữ số';
      }
    } else if (paymentMethod === 'bank') {
      if (!paymentData.bankCode) {
        newErrors.bankCode = 'Mã ngân hàng là bắt buộc';
      }
      if (!paymentData.accountNumber) {
        newErrors.accountNumber = 'Số tài khoản là bắt buộc';
      }
    } else if (paymentMethod === 'insurance') {
      if (!paymentData.insuranceNumber) {
        newErrors.insuranceNumber = 'Số bảo hiểm y tế là bắt buộc';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Tạo payment data để gửi đến API
      const paymentData = {
        amount: Number(amount),
        method: paymentMethod,
        paymentDate: new Date().toISOString(),
        notes: `Thanh toán cho ${bookingType === 'appointment' ? 'tư vấn trực tuyến' : 'lịch xét nghiệm'} #${bookingId}`,
        patient: { id: 1 }, // Cần lấy từ context hoặc props
        onlineConsultation: bookingType === 'appointment' ? { id: bookingId } : null,
        labBooking: bookingType === 'test' ? { id: bookingId } : null,
        status: 'PENDING'
      };
      
      const response = await paymentService.createPayment(paymentData);
      
      const paymentResult = {
        id: response.data.id,
        amount: response.data.amount,
        method: response.data.method,
        status: response.data.status,
        bookingType,
        bookingId,
        paymentDate: response.data.paymentDate,
        notes: response.data.notes
      };
      
      onPaymentSuccess(paymentResult);
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ general: 'Thanh toán thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25"></div>
      <div className="relative bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Thanh toán</h3>
            <p className="text-sm text-gray-500">
              {bookingType === 'appointment' ? 'Tư vấn trực tuyến' : 'Lịch xét nghiệm'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {amount.toLocaleString('vi-VN')} VNĐ
            </div>
            <div className="text-sm text-gray-500">Tổng tiền</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn phương thức thanh toán</h4>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                    paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentData(prev => ({ ...prev, method: e.target.value }));
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      paymentMethod === method.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số thẻ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentData.cardNumber || ''}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ thẻ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardHolder || ''}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                      errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="NGUYEN VAN A"
                  />
                  {errors.cardHolder && (
                    <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate || ''}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentData.cvv || ''}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã ngân hàng <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentData.bankCode || ''}
                  onChange={(e) => handleInputChange('bankCode', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.bankCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="VCB">Vietcombank</option>
                  <option value="TCB">Techcombank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="ACB">ACB</option>
                  <option value="MB">MB Bank</option>
                </select>
                {errors.bankCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.bankCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentData.accountNumber || ''}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số tài khoản"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>
                )}
              </div>
            </div>
          )}

          {paymentMethod === 'insurance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số bảo hiểm y tế <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={paymentData.insuranceNumber || ''}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                  errors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập số bảo hiểm y tế"
              />
              {errors.insuranceNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.insuranceNumber}</p>
              )}
            </div>
          )}

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Thông tin thanh toán được mã hóa và bảo mật</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onPaymentCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Thanh toán {amount.toLocaleString('vi-VN')} VNĐ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm; 