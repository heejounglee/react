import React, { useState } from 'react';
import '../styles/Login.css';
import posBg from '../assets/images/posbackgr1.jpg';

// 상단 파라미터 부분에 { setIsLoggedIn } 을 추가합니다.
const LoginPage = ({ setIsLoggedIn }) => { 
  const [loginData, setLoginData] = useState({ id: '', pw: '' });
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 검증 로직 (실제 서비스에서는 API 통신)
    console.log("로그인 시도:", loginData);
    
    // 부모(App.js)로부터 받은 함수를 실행합니다.
    setIsLoggedIn(true); 
  };

  return (
    <div className="logout-main" style={{ backgroundImage: `url(${posBg})` }}>
      {/* 배경 장식 요소 */}
      <div className="bg-blur-effect"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">📊</div>
          <p>통합 관리 시스템에 접속하세요</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>ID</label>
            <input 
              type="text" 
              name="id"
              placeholder="아이디를 입력하세요" 
              value={loginData.id}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="pw-input-wrapper">
              <input 
                type={showPw ? "text" : "password"} 
                name="pw"
                placeholder="비밀번호를 입력하세요" 
                value={loginData.pw}
                onChange={handleChange}
                required 
              />
              <button 
                type="button" 
                className="pw-toggle"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input type="checkbox" /> 로그인 유지
            </label>
            <span className="find-pw">비밀번호 찾기</span>
          </div>

          <button type="submit" className="login-submit-btn">
            Login Now
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 POS Inc. All rights reserved.</p>
          <div className="system-status">
            <span className="status-dot"></span> System Normal
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
