// src/pages/InventoryStatusPage.jsx
import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
// AG Grid 필수 CSS 임포트
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import '../styles/ProductManagement.css'; // 스타일 재사용

ModuleRegistry.registerModules([AllCommunityModule]);

const InventoryStatusPage = () => {
  const gridRef = useRef(null);
  
  // 임시 재고 데이터
  const [rowData, setRowData] = useState([
    { prodCode: 'A001', prodName: '아메리카노', group: '커피', currentStock: 150, safeStock: 50, status: '양호' },
    { prodCode: 'B002', prodName: '치즈케이크', group: '케이크', currentStock: 15, safeStock: 20, status: '부족' },
    { prodCode: 'A003', prodName: '카페라떼', group: '커피', currentStock: 80, safeStock: 50, status: '양호' },
    { prodCode: 'D004', prodName: '텀블러', group: 'MD상품', currentStock: 5, safeStock: 10, status: '부족' },
    { prodCode: 'A005', prodName: '에스프레소 원두', group: '원자재', currentStock: 300, safeStock: 100, status: '양호' },
  ]);

  // AG Grid 컬럼 정의
  const [columnDefs] = useState([
    { headerName: "품목코드", field: "prodCode", sortable: true, filter: true },
    { headerName: "품목명", field: "prodName", sortable: true, filter: true },
    { headerName: "품목그룹", field: "group", sortable: true, filter: true },
    { 
        headerName: "현재고수량", 
        field: "currentStock", 
        sortable: true, 
        filter: 'agNumberColumnFilter' 
    },
    { 
        headerName: "안전재고", 
        field: "safeStock", 
        sortable: true, 
        filter: 'agNumberColumnFilter' 
    },
    { 
        headerName: "상태", 
        field: "status",
        // 셀 스타일을 조건부로 적용하여 시각화
        cellStyle: params => {
            if (params.value === '부족') {
                return { color: 'white', backgroundColor: '#dc3545', fontWeight: 'bold' }; // 빨간색 배경
            }
            if (params.value === '양호') {
                return { color: 'white', backgroundColor: '#28a745' }; // 초록색 배경
            }
            return null;
        }
    },
  ]);

  // 재고 현황 새로고침 (API 호출하여 최신 데이터 가져오는 함수)
  const handleRefresh = () => {
    console.log("재고 현황 데이터를 서버로부터 새로고침합니다.");
    // 실제 API 호출 로직 (예: axios.get('/api/inventory-status'))
    // setRowData(fetchedData);
    alert("재고 현황이 업데이트되었습니다.");
  };

  return (
    <div>
      <h2>📊 재고 현황</h2>
      
      <div className="inventory-header">
        <p>현재 시점의 품목별 재고 수량을 확인합니다.</p>
        <div>
            <button className="action-button" onClick={handleRefresh}>
                새로고침
            </button>
            {/* 재고 조정 페이지로 이동하는 버튼 등을 추가할 수 있습니다. */}
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: '100%', marginTop: '10px' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}          
          columnDefs={columnDefs}    
          pagination={true}          
          paginationPageSize={20}    
          defaultColDef={{ resizable: true, flex: 1, sortable: true, filter: true }}
          theme="legacy"
        />
      </div>
      
    </div>
  );
};

export default InventoryStatusPage;
