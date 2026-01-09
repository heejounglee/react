import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import Header from './Header';
import Footer from './Footer';
import Navigator from './Navigator';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 세션이나 로컬스토리지 삭제 로직이 있다면 여기에 추가
      // localStorage.removeItem('userToken'); 
      navigate('/'); // 로그인 페이지로 이동
    }
  };

  return (
    <div className="app-container">
      {/* Header에 로그아웃 함수 전달 */}
      <Header toggleNav={toggleNav} onLogout={handleLogout} />
      
      <div className="main-content-wrapper">
        <Navigator isOpen={isNavOpen} />
        
        <main className="content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
