// src/pages/OrderListPage.jsx
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import BarcodeOrderModal from '../components/BarcodeOrderModal'; 
import ReceiptModal from '../components/ReceiptModal'; 
import axios from 'axios';

ModuleRegistry.registerModules([AllCommunityModule]);

const OrderListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 

  // 영수증 모달 상태
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 더블클릭 핸들러
  const onRowDoubleClicked = (params) => {
    setSelectedOrder(params.data);
    setIsReceiptOpen(true);
  };

  const handleScanSuccess = (barcode) => {
    alert(`스캔된 바코드: ${barcode} (주문 처리 로직 실행)`);
    setIsModalOpen(false);
  };

  const [columnDefs] = useState([
    { headerName: "주문 번호", field: "ordno", sortable: true, filter: true, width: 120 },
    { headerName: "주문 시간", field: "odate", sortable: true, filter: true, width: 180 },
    { headerName: "고객명", field: "userid", sortable: true, filter: true },
    { headerName: "총 금액", field: "amount", sortable: true, filter: true, cellRenderer: (params) => {
        return params.value.toLocaleString() + ' 원';
    }},
    { headerName: "결제 수단", field: "paytype" },
    { headerName: "상태", field: "ostatus", cellRenderer: (params) => {
        let color = '';
        if (params.value === '완료') color = 'green';
        else if (params.value === '취소') color = 'red';
        else color = 'orange';
        return <span style={{ color: color, fontWeight: 'bold' }}>{params.value}</span>;
    }},
  ]);

  const [rowData, setRowData] = useState([
    { ordno: "ORD001", odate: "2025-01-01 10:00", userid: "김철수", amount: 55000, paytype: "카드결제", ostatus: "완료" },
    { ordno: "ORD002", odate: "2025-01-01 11:30", userid: "이영희", amount: 12000, paytype: "현금", ostatus: "완료" },
    { ordno: "ORD003", odate: "2025-01-01 12:45", userid: "박지성", amount: 30000, paytype: "카카오페이", ostatus: "대기중" },
    { ordno: "ORD004", odate: "2025-01-01 14:00", userid: "익명", amount: 8000, paytype: "카드결제", ostatus: "취소" },
    { ordno: "ORD005", odate: "2025-01-01 16:15", userid: "김철수", amount: 21000, paytype: "카드결제", ostatus: "완료" },
  ]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => {
          // DB 컬럼명과 Ag-Grid field명을 맞춰야 합니다.
          // 예: orderId -> ordno, customerName -> userid 등
          setRowData(res.data);
      });
}, []);

   //결제 완료 시 호출될 함수
  const handleOrderComplete = async (newOrderData) => {
    const response = await axios.post('/api/orders', newOrderData);
    setRowData(prevData => [response.data, ...prevData]);
    setIsModalOpen(false);
};


  return (
    <div>
      <h2>📋 주문 목록</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>전체 주문 내역을 확인하고 관리합니다.</p>
        {/* 3. 주문하기 버튼 추가 */}
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🛒 주문하기 (바코드 스캔)
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{ resizable: true, flex: 1 }}
          onRowDoubleClicked={onRowDoubleClicked} // 이벤트 연결
          theme="legacy" 
        />
      </div>

      {/* 모달에 결제 완료 처리 함수 전달 */}
      <BarcodeOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        /* onScanSuccess={handleScanSuccess}  */
        onOrderComplete={handleOrderComplete} 
      />

      {/* 영수증 모달 */}
      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        orderData={selectedOrder}
      />

    </div>
  );
};

export default OrderListPage;
