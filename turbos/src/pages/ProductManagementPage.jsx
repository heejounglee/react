// src/pages/ProductManagementPage.jsx
import React, { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
// AG Grid 필수 CSS 임포트
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Modal from '../components/Modal'; // 커스텀 모달 컴포넌트 임포트
import '../styles/ProductManagement.css'; // 상품관리 전용 스타일
import '../styles/Modal.css'; // 스타일 재사용

// eslint-disable-next-line import/first, import/newline-after-import
ModuleRegistry.registerModules([AllCommunityModule]);

const ProductManagementPage = () => {
  const gridRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // 수정할 상품 정보
  const [rowData, setRowData] = useState([
    { prodCode: 'A001', prodName: '아메리카노', type: '음료', spec: 'Tall', group: '커피', vendorType: '본사', vendorName: 'POS Inc.' },
    { prodCode: 'B002', prodName: '치즈케이크', type: '디저트', spec: '조각', group: '케이크', vendorType: '외부', vendorName: 'ABC베이커리' },
  ]);

  const [columnDefs] = useState([
    // 체크박스 컬럼 추가
    { headerCheckboxSelection: true, checkboxSelection: true, width: 60, suppressMenu: true },
    { headerName: "품목코드", field: "prodCode", sortable: true, filter: true },
    { headerName: "품목명", field: "prodName", sortable: true, filter: true },
    { headerName: "품목구분", field: "type" },
    { headerName: "규격정보", field: "spec" },
    { headerName: "품목그룹", field: "group" },
    { headerName: "거래처명", field: "vendorName" },
  ]);

  // --- 수정 기능 ---
  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 1) {
      setSelectedProduct(selectedRows[0]); // 선택된 상품 모달에 전달
      setIsModalOpen(true);
    } else {
      alert("수정할 상품 하나만 선택해주세요.");
    }
  };

  const handleProductUpdate = (updatedProduct) => {
    // 실제 서버 통신 후 목록 업데이트 로직
    console.log("상품 업데이트:", updatedProduct);
    
    // rowData에서 해당 상품 찾아서 교체
    const updatedData = rowData.map(row => 
        row.prodCode === updatedProduct.prodCode ? updatedProduct : row
    );
    setRowData(updatedData);
    
    closeModal();
  };

  // --- 삭제 기능 ---
  const handleDelete = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
        alert("삭제할 상품을 하나 이상 선택해주세요.");
        return;
    }
    
    if (window.confirm(`${selectedRows.length}개의 상품을 삭제하시겠습니까?`)) {
        // 실제 서버 통신 후 목록 업데이트 로직
        const selectedCodes = selectedRows.map(row => row.prodCode);
        const filteredData = rowData.filter(row => !selectedCodes.includes(row.prodCode));
        setRowData(filteredData);
        alert("삭제되었습니다.");
    }
  }, [rowData]);

   const openModal = () => setIsModalOpen(true);

  const handleProductSubmit = (newProduct) => {
    // 실제 서버 통신 로직 (API 호출)이 들어갈 자리입니다.
    console.log("새 상품 등록:", newProduct);
    // 임시로 rowData에 새 상품 추가
    setRowData([...rowData, newProduct]);
    closeModal();
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // 모달 닫을 때 선택된 상품 초기화
  };


  return (
    <div>
      <h2>✏️ 품목 수정/삭제</h2>
      
      <div className="list-header">
        <p>품목 리스트에서 수정/삭제할 항목을 선택하세요.</p>
        <div>
            <button className="register-button" onClick={handleEdit} style={{marginRight: '10px'}}>
                수정
            </button>
            <button className="register-button" onClick={handleDelete} style={{backgroundColor: '#dc3545',marginRight: '10px'} }>
                삭제
            </button>
            <button className="register-button" onClick={openModal}>
             ➕ 신규
           </button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: '100%', marginTop: '10px' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}          
          columnDefs={columnDefs}    
          pagination={true}          
          paginationPageSize={15}    
          rowSelection={'multiple'} // 다중 선택 가능하도록 설정
          defaultColDef={{ resizable: true, flex: 1 }}
          theme="legacy"
        />
      </div>

      {/* 수정 모달 (등록 모달과 동일한 컴포넌트 재사용, 초기값만 전달) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleProductUpdate} // 업데이트 핸들러 전달
        initialData={selectedProduct} // 현재 선택된 데이터 전달
      />

      {/* 품목 등록 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleProductSubmit} />


      
    </div>
  );
};

export default ProductManagementPage;
