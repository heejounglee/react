// src/pages/SystemSettingsPage.jsx
import React, { useState } from 'react';
import '../styles/SystemSettings.css'; // 새 스타일시트 임포트

const SystemSettingsPage = () => {
  // 실제 백엔드 API에서 불러온다고 가정한 설정 값들
  const [settings, setSettings] = useState({
    safeStockAlertThreshold: 10, // 알림 기준 (퍼센트)
    currencyUnit: 'KRW',         // 통화 단위 (KRW, USD)
    systemActive: true           // 시스템 활성화 여부
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    // 백엔드 API로 설정 값 저장 로직 (Axios.post 등 사용)
    console.log("저장할 설정:", settings);
    alert("시스템 설정이 성공적으로 저장되었습니다.");
  };

  return (
    <div className="settings-container">
      <h2>⚙️ 시스템 설정</h2>
      
      <div className="settings-section">
        <h3>재고 관리 설정</h3>
        <div className="setting-item">
          <label htmlFor="safeStockAlertThreshold">안전 재고 부족 알림 임계값 (%)</label>
          <input
            type="number"
            id="safeStockAlertThreshold"
            name="safeStockAlertThreshold"
            value={settings.safeStockAlertThreshold}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>일반 설정</h3>
        <div className="setting-item">
          <label htmlFor="currencyUnit">기본 통화 단위</label>
          <select
            id="currencyUnit"
            name="currencyUnit"
            value={settings.currencyUnit}
            onChange={handleChange}
          >
            <option value="KRW">대한민국 원 (KRW)</option>
            <option value="USD">미국 달러 (USD)</option>
            <option value="EUR">유로 (EUR)</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label htmlFor="systemActive">시스템 운영 활성화</label>
          <input
            type="checkbox"
            id="systemActive"
            name="systemActive"
            checked={settings.systemActive}
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* 사용자 관리 페이지로 이동하는 버튼 (예시) */}
      <div className="settings-section">
        <h3>사용자 및 권한 관리</h3>
        <button className="action-button" onClick={() => console.log('사용자 관리 페이지로 이동')}>
            사용자 관리 페이지로 이동
        </button>
      </div>


      <button className="save-button" onClick={handleSaveSettings}>
        설정 저장
      </button>
    </div>
  );
};

export default SystemSettingsPage;
