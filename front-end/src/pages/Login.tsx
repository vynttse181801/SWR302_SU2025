import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { images } from '../constants/images';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const { accessToken, username, email, fullName, role, id } = response;

      const loggedInUser: User = {
        id: id.toString(),
        name: fullName,
        email: email,
        username: username,
        role: role as User['role'],
      };

      authLogin(loggedInUser, accessToken);

      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));

      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'DOCTOR') {
        navigate('/doctor');
      } else if (role === 'ROLE_PATIENT') {
        navigate('/patient');
      } else if (role === 'ROLE_STAFF') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <img
          src={images.consultation}
          alt="Background"
          className="w-full h-full object-cover filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/90 via-secondary-800/80 to-accent-900/90"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-glow">
            Đăng nhập
          </h2>
          <p className="text-secondary-100">
            Hoặc{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-secondary-200 hover:text-white transition-colors"
            >
              đăng ký tài khoản mới
            </button>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/[0.15] focus:bg-white/[0.15]"
                placeholder="Tên đăng nhập"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/[0.15] focus:bg-white/[0.15]"
                  placeholder="Mật khẩu"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-secondary-500 focus:ring-2 focus:ring-white/50 group-hover:border-white/40"
              />
              <label htmlFor="remember-me" className="text-sm text-white/80 group-hover:text-white transition-colors">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="font-medium text-secondary-200 hover:text-white transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-lg
                bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600
                transition-all duration-300
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;