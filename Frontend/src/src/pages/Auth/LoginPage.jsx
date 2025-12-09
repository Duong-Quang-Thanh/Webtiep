import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Headphones } from 'react-feather';

const BACKGROUND_URL = "https://i.pinimg.com/1200x/cd/fb/c7/cdfbc75280e35fbfd63647e2259d7910.jpg"; 
const LOGO_URL = "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"; 

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.password) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return;
    }
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (error) {
      alert(error.message || 'Sai thông tin đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    "Câu hỏi thường gặp", "Trung tâm trợ giúp", "Điều khoản sử dụng", "Quyền riêng tư",
    "Tùy chọn cookie", "Thông tin doanh nghiệp"
  ];

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{ 
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url(${BACKGROUND_URL})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
    >
      <header className="px-[4%] h-20 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="h-[35px]" /> 
          <h1 className="text-[#316fe2] text-2xl font-extrabold tracking-wide drop-shadow-md m-0">
            MANAGEMENT SYSTEM
          </h1>
        </div>
        <div className="flex gap-6 text-white text-sm font-medium drop-shadow-md">
          <span className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2">
            <Mail size={16} /> ms@company.com
          </span>
          <span className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2">
            <Headphones size={16} /> Hỗ trợ
          </span>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center z-10 px-4">
        <div className="w-[380px] bg-black/75 rounded-lg p-[30px] shadow-2xl backdrop-blur-sm">
          <h2 className="text-white text-3xl font-bold mb-7">Đăng nhập</h2>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <input 
                type="text" 
                name="username"           
                autoComplete="username"
                placeholder="Tên đăng nhập" 
                className="input-netflix" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="relative mb-2">
              <input 
                type="password" 
                name="password"
                autoComplete="current-password"
                placeholder="Mật khẩu" 
                className="input-netflix"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className={`btn-netflix flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : "Đăng nhập"}
            </button>
          </form>

           <div className="mt-4 flex justify-between text-[#b3b3b3] text-xs">
              <div className="flex items-center gap-1">
                 <input type="checkbox" id="remember" className="rounded bg-[#333] border-0" defaultChecked />
                 <label htmlFor="remember" className="cursor-pointer hover:text-white">Ghi nhớ tôi</label>
              </div>
              <a href="#" className="hover:underline hover:text-white">Bạn cần trợ giúp?</a>
           </div>
        </div>
      </main>

      <footer className="bg-black/75 text-[#737373] py-[30px] px-[10%] mt-10 z-10 text-[13px]">
        <div className="mb-5">Bạn có câu hỏi? Liên hệ với chúng tôi.</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {footerLinks.map((link, index) => (
            <a key={index} href="#" className="hover:underline hover:text-white transition-colors block mb-1">
              {link}
            </a>
          ))}
        </div>
        <div className="mt-5">© {new Date().getFullYear()} CÔNG TY TNHH ĐẠT A+ MÔN LẬP TRÌNH WEB</div>
      </footer>
    </div>
  );
};

export default LoginPage;