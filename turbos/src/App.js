// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 페이지 임포트
import LoginPage from './pages/LoginPage';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes'; // 로그인 후 전용 라우트

function App() {
  // 실제 운영 시에는 로컬스토리지나 Context API로 관리합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 1. 로그인 페이지: Layout 없이 단독 표시 */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/statistic/dashboard" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* 2. 로그인 후 전용 라우트: AuthenticatedRoutes 내부에서 Layout 적용 */}
        <Route 
          path="/*" 
          element={isLoggedIn ? <AuthenticatedRoutes /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
