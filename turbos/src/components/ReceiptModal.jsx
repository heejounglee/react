import React from 'react';
import '../styles/ReceiptModal.css';

const ReceiptModal = ({ isOpen, onClose, orderData }) => {
  if (!isOpen || !orderData) return null;

  const handlePrint = () => {
    window.print(); // 실제 출력 다이얼로그 호출
  };

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-paper" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-header">
          <h2>영 수 증</h2>
          <p className="shop-name">SMART POS MARKET</p>
          <p>대표자: 홍길동 | TEL: 02-1234-5678</p>
          <p>서울특별시 강동구 OO로 123</p>
        </div>

        <div className="receipt-divider">------------------------------------------</div>

        <div className="receipt-info">
          <p><span>주문번호 :</span> <span>{orderData.orderId}</span></p>
          <p><span>판매일시 :</span> <span>{orderData.orderTime}</span></p>
          <p><span>고 객 명 :</span> <span>{orderData.customerName}</span></p>
        </div>

        <div className="receipt-divider">------------------------------------------</div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th align="left">상품명</th>
              <th align="center">수량</th>
              <th align="right">금액</th>
            </tr>
          </thead>
          <tbody>
            {/* 실제 운영시에는 orderData 내 상세 품목 리스트를 맵핑합니다 */}
            <tr>
              <td>단일 품목(합산)</td>
              <td align="center">1</td>
              <td align="right">{orderData.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="receipt-divider">------------------------------------------</div>

        <div className="receipt-total">
          <div className="total-row">
            <span>합 계 금 액</span>
            <span>{orderData.amount.toLocaleString()} 원</span>
          </div>
          <div className="total-row sub">
            <span>결 제 수 단</span>
            <span>{orderData.paymentMethod}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p>감사합니다.</p>
          <p>2025년 이용해 주셔서 고맙습니다.</p>
          <div className="barcode-placeholder">|| |||| || ||||| |||</div>
        </div>

        <div className="receipt-actions no-print">
          <button onClick={handlePrint} className="print-btn">인쇄하기</button>
          <button onClick={onClose} className="close-btn">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
