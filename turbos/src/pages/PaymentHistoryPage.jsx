// src/pages/PaymentHistoryPage.jsx
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
// AG Grid 필수 CSS 임포트
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// eslint-disable-next-line import/first, import/newline-after-import
ModuleRegistry.registerModules([AllCommunityModule]);


const PaymentHistoryPage = () => {
  
  // 1. 컬럼 정의 (결제 내역에 맞게 수정)
  const [columnDefs] = useState([
    { headerName: "결제 번호", field: "paymentId", sortable: true, filter: true, width: 150 },
    { headerName: "주문 번호", field: "orderId", sortable: true, filter: true, width: 120 },
    { headerName: "결제 일시", field: "paymentTime", sortable: true, filter: true, width: 180 },
    { headerName: "결제 방식", field: "method", sortable: true },
    { headerName: "결제 금액", field: "amount", sortable: true, cellRenderer: (params) => {
        return params.value.toLocaleString() + ' 원';
    }},
    { headerName: "승인 번호", field: "approvalNo", width: 150 },
    { headerName: "상태", field: "status", cellRenderer: (params) => {
        let color = '';
        if (params.value === '승인 완료') color = '#000C7B'; // 메인 테마 색상 사용
        else if (params.value === '승인 취소') color = 'red';
        return <span style={{ color: color, fontWeight: 'bold' }}>{params.value}</span>;
    }},
  ]);

  // 2. 샘플 결제 데이터
  const [rowData] = useState([
    { paymentId: "PAY001", orderId: "ORD001", paymentTime: "2025-01-01 10:00", method: "카드", amount: 55000, approvalNo: "12345678", status: "승인 완료" },
    { paymentId: "PAY002", orderId: "ORD002", paymentTime: "2025-01-01 11:30", method: "현금", amount: 12000, approvalNo: "N/A", status: "승인 완료" },
    { paymentId: "PAY003", orderId: "ORD003", paymentTime: "2025-01-01 12:45", method: "카카오페이", amount: 30000, approvalNo: "P9876543", status: "승인 완료" },
    { paymentId: "PAY004", orderId: "ORD004", paymentTime: "2025-01-01 14:00", method: "카드", amount: 8000, approvalNo: "C1234567", status: "승인 취소" },
    { paymentId: "PAY005", orderId: "ORD005", paymentTime: "2025-01-01 16:15", method: "카드", amount: 21000, approvalNo: "E5432109", status: "승인 완료" },
  ]);

  // 3. AG Grid 렌더링
  return (
    <div>
      <h2>💳 결제 내역 조회</h2>
      <p>기간별, 결제 방식별 결제 승인/취소 내역을 확인합니다.</p>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <AgGridReact
          rowData={rowData}          
          columnDefs={columnDefs}    
          pagination={true}          
          paginationPageSize={10}    
          defaultColDef={{ 
            resizable: true,         
            flex: 1                  
          }}
          theme="legacy"
        />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
