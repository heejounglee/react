// src/pages/VendorListPage.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const VendorListPage = () => {
  const gridRef = useRef(null);
  const [activeTab, setActiveTab] = useState('basic');

  // --- [데이터 관리] 코드와 명칭이 포함된 마스터 데이터 ---
  const [vendorMaster] = useState([
    { code: 'V001', name: 'POS Inc.' },
    { code: 'V002', name: 'ABC Bakery' },
    { code: 'V003', name: '커피원두공급' },
    { code: 'V004', name: '디저트팩토리' },
    { code: 'V005', name: '용기제조사' },
  ]);

  const [rowData, setRowData] = useState([
    { id: 1, vendorCode: 'V001', vendorName: 'POS Inc.', bizNum: '123-45-67890', owner: '홍길동', isDirty: false },
    { id: 2, vendorCode: 'V002', vendorName: 'ABC Bakery', bizNum: '987-65-43210', owner: '김철수', isDirty: false },
  ]);

  // 이탈 방지 로직
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (rowData.some(row => row.isDirty)) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [rowData]);

  const checkAndFocusUnsaved = useCallback(() => {
    const unsavedIndex = rowData.findIndex(row => row.isDirty);
    if (unsavedIndex !== -1) {
      alert("저장되지 않은 row가 있습니다. 해당 항목을 먼저 저장해주세요.");
      gridRef.current.api.ensureIndexVisible(unsavedIndex);
      gridRef.current.api.setFocusedCell(unsavedIndex, 'vendorName');
      return true;
    }
    return false;
  }, [rowData]);

  // 행 추가
  const onAddRow = () => {
    const newRow = { id: Date.now(), vendorCode: 'V001', vendorName: 'POS Inc.', isDirty: true };
    setRowData([newRow, ...rowData]);
  };

  // 행 삭제
  const onDeleteRow = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    if (selectedData.length === 0) return alert("삭제할 행을 선택해주세요.");
    if (window.confirm("즉시 삭제하시겠습니까?")) {
      setRowData(rowData.filter(row => !selectedData.includes(row)));
    }
  };

  // --- [수정] 중복 체크 로직이 포함된 저장 핸들러 ---
  const handleSave = (data) => {
    // 1. 중복 체크: 현재 행(id)을 제외하고 동일한 vendorCode가 있는지 검사
    const isDuplicate = rowData.some(row => 
      row.id !== data.id && 
      row.vendorCode === data.vendorCode
    );

    if (isDuplicate) {
      alert(`⚠️ 중복 오류: [${data.vendorCode}] 코드는 이미 목록에 존재합니다. 다른 코드를 선택해주세요.`);
      
      // 2. 중복된 셀로 포커스 이동
      const rowIndex = rowData.findIndex(row => row.id === data.id);
      if (rowIndex !== -1) {
        gridRef.current.api.ensureIndexVisible(rowIndex);
        gridRef.current.api.setFocusedCell(rowIndex, 'vendorCode');
      }
      return; // 저장 중단
    }

    // 3. 중복이 없을 경우 저장 처리
    setRowData(prev => prev.map(row => row.id === data.id ? { ...row, isDirty: false } : row));
    alert(`[${data.vendorName}] 저장되었습니다.`);
  };

  // 셀 수정 시 이벤트
  const onCellValueChanged = (params) => {
    let newData = { ...params.data, isDirty: true };
    
    if (params.column.getColId() === 'vendorCode') {
      const matched = vendorMaster.find(m => m.code === params.newValue);
      if (matched) {
        newData.vendorName = matched.name;
      }
    }

    setRowData(prev => prev.map(row => row.id === newData.id ? newData : row));
  };

  const SaveButtonRenderer = (params) => (
    <button 
      onClick={() => handleSave(params.data)}
      style={{
        padding: '2px 10px', backgroundColor: params.data.isDirty ? '#ffc107' : '#007bff',
        color: params.data.isDirty ? '#000' : '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
      }}
    >
      {params.data.isDirty ? '미저장' : '저장'}
    </button>
  );

  const getColumnDefs = () => {
    const saveCol = { headerName: "저장", cellRenderer: SaveButtonRenderer, editable: false, maxWidth: 80, pinned: 'right' };
    
    const vendorCodeCol = { 
      headerName: "거래처 코드 선택", 
      field: "vendorCode", 
      checkboxSelection: activeTab === 'basic', 
      headerCheckboxSelection: activeTab === 'basic',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: vendorMaster.map(m => m.code),
      },
      valueFormatter: params => {
        const matched = vendorMaster.find(m => m.code === params.value);
        return matched ? `[${matched.code}] ${matched.name}` : params.value;
      }
    };

    let cols = [];
    if (activeTab === 'basic') {
      cols = [
        vendorCodeCol,
        { headerName: "거래처명", field: "vendorName", editable: false, cellStyle: { backgroundColor: '#f8f9fa' } },
        { headerName: "사업자번호", field: "bizNum" },
        { headerName: "대표자", field: "owner" }
      ];
    } else if (activeTab === 'info') {
      cols = [{ headerName: "거래처명", field: "vendorName" }, { headerName: "전화번호", field: "tel" }, { headerName: "이메일", field: "email" }];
    } else {
      cols = [{ headerName: "거래처명", field: "vendorName" }, { headerName: "은행명", field: "bank" }, { headerName: "계좌번호", field: "account" }];
    }
    return [...cols, saveCol];
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🏢 거래처 관리</h2>
        {rowData.some(r => r.isDirty) && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>⚠️ 미저장 데이터가 있습니다.</span>}
      </div>
      
      <div style={styles.tabContainer}>
        <button onClick={() => !checkAndFocusUnsaved() && setActiveTab('basic')} style={activeTab === 'basic' ? styles.activeTab : styles.tab}>기본정보</button>
        <button onClick={() => !checkAndFocusUnsaved() && setActiveTab('info')} style={activeTab === 'info' ? styles.activeTab : styles.tab}>거래처정보</button>
        <button onClick={() => !checkAndFocusUnsaved() && setActiveTab('extra')} style={activeTab === 'extra' ? styles.activeTab : styles.tab}>부가정보</button>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onAddRow} style={styles.addBtn}>+ 행 추가</button>
        <button onClick={onDeleteRow} style={styles.delBtn}>- 선택 삭제 (즉시)</button>
      </div>

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={getColumnDefs()}
          defaultColDef={{ flex: 1, editable: true, resizable: true, sortable: true, filter: true, singleClickEdit: true }}
          rowSelection="multiple"
          onCellValueChanged={onCellValueChanged}
          theme="legacy"
        />
      </div>
    </div>
  );
};

const styles = {
  tabContainer: { display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '20px' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '16px' },
  activeTab: { padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '16px', borderBottom: '3px solid #007bff', fontWeight: 'bold', color: '#007bff' },
  addBtn: { padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  delBtn: { padding: '8px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default VendorListPage;
