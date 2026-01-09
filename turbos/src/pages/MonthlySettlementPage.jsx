import React, { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const MonthlySettlementPage = () => {
  const gridRef = useRef(null);

  // 1. 샘플 데이터 상태 (조정액은 초기값 0 또는 데이터로 관리)
  const [rowData, setRowData] = useState([
    { month: '2025-10', salesTotal: 50000000, purchaseTotal: 20000000, rent: 3000000, labor: 15000000, adjustment: 0, status: '마감완료' },
    { month: '2025-11', salesTotal: 45000000, purchaseTotal: 18000000, rent: 3000000, labor: 14000000, adjustment: -500000, status: '미마감' },
    { month: '2025-12', salesTotal: 55000000, purchaseTotal: 22000000, rent: 3000000, labor: 16000000, adjustment: 0, status: '미마감' },
  ]);

  // 2. 컬럼 정의
  const columnDefs = [
    { headerName: "정산 월", field: "month", sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true },
    { 
      headerName: "매출합", 
      field: "salesTotal", 
      valueFormatter: params => params.value.toLocaleString() + "원" 
    },
    { 
      headerName: "물품매입합", 
      field: "purchaseTotal", 
      valueFormatter: params => params.value.toLocaleString() + "원" 
    },
    { 
      headerName: "임대료", 
      field: "rent", 
      valueFormatter: params => params.value.toLocaleString() + "원" 
    },
    { 
      headerName: "인건비", 
      field: "labor", 
      valueFormatter: params => params.value.toLocaleString() + "원" 
    },
    { 
      headerName: "조정액(수기)", 
      field: "adjustment", 
      editable: params => params.data.status === '미마감', // 미마감 상태일 때만 수정 가능
      cellEditor: 'agNumberCellEditor',
      cellStyle: params => ({
        backgroundColor: params.data.status === '미마감' ? '#fff9db' : '#f8f9fa',
        textAlign: 'right',
        color: params.value < 0 ? 'red' : 'blue'
      }),
      valueFormatter: params => params.value.toLocaleString() + "원"
    },
    { 
      headerName: "순이익", 
      // 계산식: 매출합 - 물품매입합 - 임대료 - 인건비 + 조정액
      valueGetter: params => {
        const d = params.data;
        return Number(d.salesTotal) - Number(d.purchaseTotal) - Number(d.rent) - Number(d.labor) + Number(d.adjustment);
      },
      valueFormatter: params => params.value.toLocaleString() + "원",
      cellStyle: { textAlign: 'right', fontWeight: 'bold', backgroundColor: '#e7f5ff' }
    },
    { 
      headerName: "상태", 
      field: "status",
      cellRenderer: (params) => {
        const isDone = params.value === '마감완료';
        return (
          <span style={{ 
            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
            backgroundColor: isDone ? '#28a745' : '#ffc107', color: isDone ? '#fff' : '#000'
          }}>
            {params.value}
          </span>
        );
      }
    }
  ];

  // 3. 셀 값 변경 시 데이터 업데이트 (조정액 입력 시 실시간 반영)
  const onCellValueChanged = useCallback((params) => {
    if (params.column.colId === 'adjustment') {
      const updatedData = rowData.map(row => 
        row.month === params.data.month ? { ...params.data } : row
      );
      setRowData(updatedData);
    }
  }, [rowData]);

  // 4. 월마감 확정 로직
  const handleConfirmMonthEnd = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);

    if (selectedData.length === 0) {
      alert("마감 확정할 월을 선택해주세요.");
      return;
    }

    if (selectedData.some(row => row.status === '마감완료')) {
      alert("이미 마감 완료된 월이 포함되어 있습니다.");
      return;
    }

    if (window.confirm(`${selectedData.length}건의 월마감을 확정하시겠습니까?\n확정 후에는 조정액 수정이 불가능합니다.`)) {
      const selectedMonths = selectedData.map(row => row.month);
      const newData = rowData.map(row => 
        selectedMonths.includes(row.month) ? { ...row, status: '마감완료' } : row
      );
      setRowData(newData);
      alert("월마감 처리가 완료되었습니다.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0 }}>📅 월정산 현황</h2>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
            * 미마감 상태의 월은 <strong>조정액</strong>을 더블클릭하여 수기로 입력할 수 있습니다.
          </p>
        </div>
        <button 
          onClick={handleConfirmMonthEnd}
          style={{
            padding: '10px 25px', backgroundColor: '#28a745', color: '#fff',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          ✅ 월마감 확정
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, resizable: true, sortable: true, filter: true }}
          rowSelection="multiple"
          onCellValueChanged={onCellValueChanged}
          theme="legacy"
        />
      </div>

      {/* 요약 카드 */}
      <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #dee2e6' }}>
        <h4 style={{ marginTop: 0 }}>2025년 누적 순이익 요약</h4>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          {rowData.reduce((acc, cur) => {
            const profit = Number(cur.salesTotal) - Number(cur.purchaseTotal) - Number(cur.rent) - Number(cur.labor) + Number(cur.adjustment);
            return acc + profit;
          }, 0).toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default MonthlySettlementPage;
