import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { paymentService } from '../services/api';
import { format } from 'date-fns';
import { CreditCard, Building, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
  notes: string;
  appointment?: {
    id: number;
  };
  labBooking?: {
    id: number;
  };
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <Building className="w-4 h-4" />;
      case 'insurance':
        return <Shield className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return 'Thẻ tín dụng/ghi nợ';
      case 'bank':
        return 'Chuyển khoản ngân hàng';
      case 'insurance':
        return 'Bảo hiểm y tế';
      default:
        return method;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingType = (payment: Payment) => {
    if (payment.appointment) {
      return 'Lịch tư vấn';
    } else if (payment.labBooking) {
      return 'Lịch xét nghiệm';
    }
    return 'Khác';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Lịch sử thanh toán</h2>
        <button
          onClick={fetchPayments}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Làm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có giao dịch thanh toán</h3>
          <p className="mt-1 text-sm text-gray-500">Bạn chưa thực hiện giao dịch thanh toán nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {getMethodIcon(payment.method)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {getBookingType(payment)}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        {getMethodIcon(payment.method)}
                        <span>{getMethodName(payment.method)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{format(new Date(payment.paymentDate), 'dd/MM/yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {payment.amount.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </div>
                </div>
              </div>
              {payment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{payment.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 