import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testResultService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TestResult {
  id: number;
  testName: string;
  testDate: string;
  result: string;
  status: 'NORMAL' | 'ABNORMAL';
  notes: string;
  doctorName: string;
}

const TestResultsPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const results = await testResultService.getTestResults();
        setTestResults(results.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải kết quả xét nghiệm');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kết quả xét nghiệm</h1>

          {testResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có kết quả xét nghiệm nào</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          result.status === 'NORMAL'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.status === 'NORMAL' ? 'Bình thường' : 'Bất thường'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Ngày xét nghiệm</p>
                        <p className="text-gray-900">
                          {format(new Date(result.testDate), 'dd/MM/yyyy')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Kết quả</p>
                        <p className="text-gray-900">{result.result}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Bác sĩ</p>
                        <p className="text-gray-900">{result.doctorName}</p>
                      </div>

                      {result.notes && (
                        <div>
                          <p className="text-sm text-gray-500">Ghi chú</p>
                          <p className="text-gray-900">{result.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TestResultsPage;
