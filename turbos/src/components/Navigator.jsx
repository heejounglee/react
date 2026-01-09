// src/components/Navigator.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '../data/menuData';

// 개별 메뉴 아이템 컴포넌트 (재귀적으로 사용)
const MenuItem = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <li className="menu-item">
      <Link to={item.path} style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333' }}>
        {item.icon} {item.label}
      </Link>
      {item.children && item.children.length > 0 && (
        <ul className="submenu">
          {item.children.map(child => (
            <MenuItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// 메인 네비게이터 컴포넌트
const Navigator = ({ isOpen }) => {
  return (
    <nav className={`navigator ${isOpen ? 'is-open' : ''}`}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigator;
