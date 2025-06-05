import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { images } from '../constants/images';
import { LoginPageProps, User } from '../types';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic with API
    // For now, we'll simulate a successful login
    const mockUser: User = {
      id: '1',
      name: 'Nguyễn Văn A',
      email: formData.email,
      role: 'patient'
    };
    onLogin(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={images.doctorTeam}
          alt="Background"
          className="w-full h-full object-cover filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-secondary-900/90"></div>
      </div>
      
      {/* Content */}
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-glow">Đăng nhập</h2>
          <p className="text-primary-100 text-lg">Chào mừng bạn trở lại với HIV Care</p>
        </div>

        <div className="relative animate-fade-up">
          {/* Glassmorphism container with shining effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000"></div>
            
            <div className="relative bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                    hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                    placeholder="example@gmail.com"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300
                      hover:bg-white/[0.15] focus:bg-white/[0.15]" 
                      placeholder="Nhập mật khẩu của bạn"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/quen-mat-khau" className="text-primary-200 hover:text-white transition-colors">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold
                  hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-white/50 focus:outline-none 
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                  shadow-lg hover:shadow-primary-500/25"
                >
                  Đăng nhập
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/80">
                  Chưa có tài khoản?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-primary-200 hover:text-white transition-colors"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;