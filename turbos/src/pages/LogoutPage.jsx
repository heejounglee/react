import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logoutBg from '../assets/images/posbackgr1.jpg';
import '../styles/Logout.css';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 로그인 페이지로 자동 이동
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-page-container">
      {/* 기존 Header 재사용 */}
      <Header />

      <main className="logout-main" style={{ backgroundImage: `url(${logoutBg})` }}>
        <div className="logout-overlay">
          <div className="logout-content-card">
            <div className="logout-icon-animated">👋</div>
            <h1>로그아웃 되었습니다</h1>
            <p>안전하게 로그아웃이 완료되었습니다.<br />잠시 후 로그인 페이지로 이동합니다.</p>
            
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>

            <button className="go-login-btn" onClick={() => navigate('/')}>
              지금 바로 이동
            </button>
          </div>
        </div>
      </main>

      {/* 기존 Footer 재사용 */}
      <Footer />
    </div>
  );
};

export default LogoutPage;
