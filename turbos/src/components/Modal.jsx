// src/components/Modal.jsx (업데이트된 코드)
import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; 

// initialData prop을 추가로 받습니다.
const Modal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    prodCode: '', prodName: '', type: '', spec: '', group: '', vendorType: '', vendorName: ''
  });

  // initialData가 변경될 때마다 폼 데이터를 업데이트 (수정 모드 진입 시)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // 등록 모드일 때는 폼 초기화
      setFormData({ prodCode: '', prodName: '', type: '', spec: '', group: '', vendorType: '', vendorName: '' });
    }
  }, [initialData, isOpen]); // 모달이 열리거나 초기 데이터가 바뀌면 실행

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> 
        <div className="modal-header">
          {/* initialData 유무에 따라 타이틀 변경 */}
          <h2>{initialData ? '상품 정보 수정' : '상품 등록'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            품목코드:
            {/* 수정 모드에서는 코드 변경 불가하도록 disabled 처리 */}
            <input type="text" name="prodCode" value={formData.prodCode} onChange={handleChange} required disabled={!!initialData} />
          </label>
          <label>
            품목명:
            <input type="text" name="prodName" value={formData.prodName} onChange={handleChange} required />
          </label>
          
          <label>
            품목구분:
            <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">선택</option>
                <option value="음료">음료</option>
                <option value="디저트">디저트</option>
            </select>
          </label>
          {/* ... 나머지 입력 필드들 ... (생략) */}
          <label> 규격정보: <input type="text" name="spec" value={formData.spec} onChange={handleChange} /> </label>
          <label> 품목그룹: <input type="text" name="group" value={formData.group} onChange={handleChange} /> </label>
          <label> 거래처구분: 
             <select name="vendorType" value={formData.vendorType} onChange={handleChange}>
                <option value="">선택</option>
                <option value="본사">본사</option>
                <option value="외부">외부</option>
            </select>
          </label>
          <label> 거래처명: <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} /> </label>


          <button type="submit" className="submit-button">
            {initialData ? '수정 완료' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
