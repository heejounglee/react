import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const DailySettlementPage = () => {
  const gridRef = useRef(null);

  // 1. 샘플 정산 데이터 상태
  const [rowData, setRowData] = useState([
    { date: '2025-12-15', totalSales: 1500000, cancelAmt: 50000, discountAmt: 30000, expenseAmt: 200000, status: '미마감' },
    { date: '2025-12-16', totalSales: 2100000, cancelAmt: 120000, discountAmt: 45000, expenseAmt: 150000, status: '마감완료' },
    { date: '2025-12-17', totalSales: 1850000, cancelAmt: 20000, discountAmt: 10000, expenseAmt: 180000, status: '미마감' },
  ]);

  // 2. 컬럼 정의
  const columnDefs = [
    { headerName: "정산 일자", field: "date", sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true },
    { 
      headerName: "총 판매액", 
      field: "totalSales", 
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right' }
    },
    { 
      headerName: "취소 금액", 
      field: "cancelAmt", 
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right', color: '#dc3545' } 
    },
    { 
      headerName: "할인 금액", 
      field: "discountAmt", 
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right', color: '#007bff' }
    },
    { 
      headerName: "지출 금액", 
      field: "expenseAmt", 
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right' }
    },
    { 
      headerName: "순매출액", 
      valueGetter: params => params.data.totalSales - params.data.cancelAmt - params.data.discountAmt - params.data.expenseAmt,
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f8f9fa' }
    },
    { 
      headerName: "마감 상태", 
      field: "status",
      cellRenderer: (params) => {
        const isComplete = params.value === '마감완료';
        return (
          <span style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            backgroundColor: isComplete ? '#28a745' : '#ffc107',
            color: isComplete ? '#white' : '#000',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            {params.value}
          </span>
        );
      }
    },
  ];

  // 3. 일마감 확정 로직
  const handleConfirmSettle = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);

    if (selectedData.length === 0) {
      alert("마감 확정할 일자를 선택해주세요.");
      return;
    }

    const alreadyDone = selectedData.some(row => row.status === '마감완료');
    if (alreadyDone) {
      alert("이미 마감 완료된 일자가 포함되어 있습니다.");
      return;
    }

    if (window.confirm(`${selectedData.length}건의 일마감을 확정하시겠습니까?\n확정 후에는 수정이 불가능합니다.`)) {
      const selectedDates = selectedData.map(row => row.date);
      
      // 상태 변경 업데이트
      const newData = rowData.map(row => 
        selectedDates.includes(row.date) ? { ...row, status: '마감완료' } : row
      );
      
      setRowData(newData);
      alert("일마감 처리가 완료되었습니다.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>📅 일정산 현황</h2>
          <p style={{ margin: '5px 0 0', color: '#666' }}>일별 매출 및 지출 내역을 확인하고 마감을 진행합니다.</p>
        </div>
        <button 
          onClick={handleConfirmSettle}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔒 일마감 확정
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            resizable: true,
            sortable: true,
            filter: true
          }}
          rowSelection="multiple"
          theme="legacy"
        />
      </div>

      {/* 요약 영역 (선택 사항) */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f3f5', borderRadius: '8px', display: 'flex', gap: '40px' }}>
        <div><strong>총 판매 합계:</strong> {rowData.reduce((acc, cur) => acc + cur.totalSales, 0).toLocaleString()}원</div>
        <div><strong>총 지출 합계:</strong> {rowData.reduce((acc, cur) => acc + cur.expenseAmt, 0).toLocaleString()}원</div>
        <div style={{ color: '#007bff' }}><strong>총 순이익:</strong> {rowData.reduce((acc, cur) => acc + (cur.totalSales - cur.cancelAmt - cur.discountAmt - cur.expenseAmt), 0).toLocaleString()}원</div>
      </div>
    </div>
  );
};

export default DailySettlementPage;
