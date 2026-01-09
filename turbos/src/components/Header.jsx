// src/components/Header.jsx
/*import React from 'react';

const Header = ({ toggleNav }) => {
  return (
    <header>
      <button className="menu-toggle" onClick={toggleNav}>
        ☰ {* 햄버거 메뉴 아이콘 *
      </button>
      <h1>POS Admin System</h1>
      <div>로그인 사용자 정보</div>
    </header>
  );
};

export default Header; */

import React from 'react';
import logoutImg from '../assets/images/logout.png'; 

const Header = ({ toggleNav, onLogout }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleNav}>☰</button>
       {/* <span className="logo-text">SMART POS ADMIN</span> */}
        <h1>POS Admin System</h1>
      </div>
      
      <div className="header-right">
        <span className="user-info">관리자님 환영합니다</span>
        <button className="logout-btn" onClick={onLogout}>
          {/* 2. 기존 텍스트 아이콘 대신 img 태그 사용 */}
          <img src={logoutImg} alt="Logout" className="logout-img-icon"
          style={{ width: '16px', height: '16px' }} 
           />
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;
