// src/pages/CodeManagementPage.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const CodeManagementPage = () => {
  const gridRef = useRef(null);
  const [activeTab, setActiveTab] = useState('product'); // 'product' 또는 'vendor'
  
  // 데이터 상태 (상품코드와 거래처코드 데이터를 분리하거나 통합 관리)
  const [productCodes, setProductCodes] = useState([
    { id: 101, code: 'P001', name: '아메리카노', category: '음료', useYn: 'Y', isDirty: false },
    { id: 102, code: 'P002', name: '카페라떼', category: '음료', useYn: 'Y', isDirty: false },
  ]);

  const [vendorCodes, setVendorCodes] = useState([
    { id: 201, code: 'V001', name: 'POS 시스템', type: '본사', isDirty: false },
    { id: 202, code: 'V002', name: '커피원두공급', type: '외부', isDirty: false },
  ]);

  // 현재 활성화된 탭의 데이터 반환
//  const getCurrentData = () => (activeTab === 'product' ? productCodes : vendorCodes);
  const getCurrentData = useCallback(() => (
  activeTab === 'product' ? productCodes : vendorCodes
), [activeTab, productCodes, vendorCodes]);

//const setCurrentData = (newData) => (activeTab === 'product' ? setProductCodes(newData) : setVendorCodes(newData));
  const setCurrentData = useCallback((newData) => (
  activeTab === 'product' ? setProductCodes(newData) : setVendorCodes(newData)
), [activeTab]);

  // 1. 페이지 이탈 방지 로직 (미저장 항목 체크)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (productCodes.some(r => r.isDirty) || vendorCodes.some(r => r.isDirty)) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [productCodes, vendorCodes]);

  // 2. 미저장 행 체크 및 포커스 이동
  const checkAndFocusUnsaved = useCallback(() => {
  const data = getCurrentData(); // 이제 이 함수는 의존성이 변경될 때만 바뀝니다.
  const unsavedIndex = data.findIndex(row => row.isDirty);
  
  if (unsavedIndex !== -1) {
    alert("저장되지 않은 코드가 있습니다. 먼저 저장해주세요.");
    gridRef.current.api.ensureIndexVisible(unsavedIndex);
    gridRef.current.api.setFocusedCell(unsavedIndex, 'name');
    return true;
  }
  return false;
}, [getCurrentData]); 


  // 3. 행 추가/삭제/저장 핸들러
  const onAddRow = () => {
    const newRow = { id: Date.now(), code: 'NEW', name: '신규 코드명', isDirty: true };
    setCurrentData([newRow, ...getCurrentData()]);
  };

  const onDeleteRow = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    if (selectedData.length === 0) return alert("삭제할 행을 선택하세요.");

    if (window.confirm("선택한 코드를 즉시 삭제하시겠습니까?")) {
      const remainingData = getCurrentData().filter(row => !selectedData.includes(row));
      setCurrentData(remainingData);
    }
  };

  const handleSave = (data) => {
    console.log(`${activeTab} 코드 저장:`, data);
    const updatedData = getCurrentData().map(row => 
      row.id === data.id ? { ...row, isDirty: false } : row
    );
    setCurrentData(updatedData);
    alert("저장되었습니다.");
  };

  const onCellValueChanged = (params) => {
    const updatedData = getCurrentData().map(row => 
      row.id === params.data.id ? { ...params.data, isDirty: true } : row
    );
    setCurrentData(updatedData);
  };

  // 4. 컬럼 정의
  const SaveButtonRenderer = (params) => (
    <button 
      onClick={() => handleSave(params.data)}
      style={{
        padding: '2px 10px',
        backgroundColor: params.data.isDirty ? '#ffc107' : '#007bff',
        color: params.data.isDirty ? '#000' : '#fff',
        border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'
      }}
    >
      {params.data.isDirty ? '미저장' : '저장'}
    </button>
  );

  const getColumnDefs = () => {
    const saveCol = { headerName: "저장", cellRenderer: SaveButtonRenderer, editable: false, maxWidth: 80, pinned: 'right' };
    
    if (activeTab === 'product') {
      return [
        { headerName: "품목코드", field: "code", checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: "품목명", field: "name" },
        { headerName: "카테고리", field: "category" },
        { headerName: "사용여부", field: "useYn", cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'] } },
        saveCol
      ];
    } else {
      return [
        { headerName: "거래처코드", field: "code", checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: "거래처명", field: "name" },
        { headerName: "거래처유형", field: "type" },
        saveCol
      ];
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🔑 코드 관리</h2>
        {(productCodes.some(r => r.isDirty) || vendorCodes.some(r => r.isDirty)) && (
          <span style={{ color: '#dc3545', fontWeight: 'bold' }}>⚠️ 저장 대기 항목 있음</span>
        )}
      </div>
      
      {/* 탭 메뉴 */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => !checkAndFocusUnsaved() && setActiveTab('product')} 
          style={activeTab === 'product' ? styles.activeTab : styles.tab}
        >
          상품 코드 관리
        </button>
        <button 
          onClick={() => !checkAndFocusUnsaved() && setActiveTab('vendor')} 
          style={activeTab === 'vendor' ? styles.activeTab : styles.tab}
        >
          거래처 코드 관리
        </button>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onAddRow} style={styles.addBtn}>+ 코드 추가</button>
        <button onClick={onDeleteRow} style={styles.delBtn}>- 코드 삭제 (즉시)</button>
      </div>

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          key={activeTab} // 탭 변경 시 그리드 초기화 방지 및 갱신용
          rowData={getCurrentData()}
          columnDefs={getColumnDefs()}
          defaultColDef={{ flex: 1, editable: true, resizable: true, sortable: true, filter: true }}
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

export default CodeManagementPage;
