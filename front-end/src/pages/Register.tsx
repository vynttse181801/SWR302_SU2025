import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { images } from '../constants/images';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordConfirmVisibility = () => setShowPasswordConfirm(!showPasswordConfirm);

  const benefits = [
    'Đặt lịch khám và xét nghiệm dễ dàng',
    'Theo dõi kết quả xét nghiệm trực tuyến',
    'Tư vấn sức khỏe 24/7',
    'Bảo mật thông tin tuyệt đối',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeToTerms) {
      setError('Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      toast.error('Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username: email, // Assuming email is used as username
        email,
        fullName,
        phoneNumber,
        password,
        role: { roleName: "ROLE_PATIENT" } // Default role for registration
      });
      
      if (response.status === 201) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        toast.error(response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi trong quá trình đăng ký.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={images.consultation}
          alt="Background"
          className="w-full h-full object-cover filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/90 via-secondary-800/80 to-accent-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Benefits Section */}
          <div className="animate-fade-in">
            <div className="text-white mb-8">
              <h3 className="text-2xl font-bold mb-6">
                Tại sao nên chọn HIV Care?
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <CheckCircle className="w-5 h-5 text-secondary-200 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-secondary-100 group-hover:text-white transition-colors">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-glow">
                Tạo tài khoản mới
              </h2>
              <p className="text-secondary-100">
                Bắt đầu hành trình chăm sóc sức khỏe của bạn
              </p>
            </div>

            {/* Glassmorphism container with shining effect */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 via-accent-400 to-secondary-400 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000"></div>

              <div className="relative bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/20">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Họ và tên
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                        hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                        placeholder="Nguyễn Văn A" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Địa chỉ email
                      </label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                        hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                        placeholder="nguyenvana@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                        hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                        placeholder="0123456789" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                          hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <input 
                          type={showPasswordConfirm ? "text" : "password"}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                          hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required 
                        />
                        <button
                          type="button"
                          onClick={togglePasswordConfirmVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 group">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        required
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-secondary-500 focus:ring-2 focus:ring-white/50
                        group-hover:border-white/40"
                      />
                      <label htmlFor="terms" className="text-sm text-white/80 group-hover:text-white transition-colors">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-secondary-200 hover:text-white transition-colors">
                          Điều khoản dịch vụ
                        </a>
                        {' '}
                        và{' '}
                        <a href="#" className="text-secondary-200 hover:text-white transition-colors">
                          Chính sách bảo mật
                        </a>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-secondary-500 to-accent-500 text-white rounded-lg font-semibold
                    hover:from-secondary-600 hover:to-accent-600 focus:ring-2 focus:ring-white/50 focus:outline-none 
                    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                    shadow-lg hover:shadow-secondary-500/25
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white/80">
                    Đã có tài khoản?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-secondary-200 hover:text-white transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
