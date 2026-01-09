import React, { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
// AG Grid 필수 CSS 및 모듈 설정
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Modal from '../components/Modal'; // 기존 모달 컴포넌트 재사용
import '../styles/ProductManagement.css'; // 기존 스타일 재사용 (register-button 등)
import '../styles/Modal.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomerManagementPage = () => {
  const gridRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // 수정할 고객 정보

  // 1. 데이터 초기값 (고객 현황 요구사항 반영)
  const [rowData, setRowData] = useState([
    { custNo: 'C2025-001', custName: '홍길동', phone: '010-1234-5678', totalPoints: 15500, grade: 'VIP', status: '활동', orderCount3Month: 12 },
    { custNo: 'C2025-002', custName: '김영희', phone: '010-9876-5432', totalPoints: 3200, grade: '일반', status: '활동', orderCount3Month: 2 },
    { custNo: 'C2025-003', custName: '이철수', phone: '010-5555-4444', totalPoints: 0, grade: '일반', status: '휴면', orderCount3Month: 0 },
  ]);

  // 2. 컬럼 정의 (고객 현황 요구사항 반영)
  const [columnDefs] = useState([
    { headerCheckboxSelection: true, checkboxSelection: true, width: 60, suppressMenu: true },
    { headerName: "고객번호", field: "custNo", sortable: true, filter: true },
    { headerName: "고객명", field: "custName", sortable: true, filter: true },
    { headerName: "휴대폰", field: "phone", filter: true },
    { 
      headerName: "총포인트", 
      field: "totalPoints", 
      valueFormatter: params => params.value?.toLocaleString() + ' P' 
    },
    { headerName: "고객등급", field: "grade", filter: true },
    { headerName: "고객상태", field: "status", filter: true },
    { headerName: "최근3개월총주문", field: "orderCount3Month", type: 'numericColumn' },
  ]);

  // --- 공통 모달 제어 ---
  const openModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  // --- 수정 기능 ---
  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 1) {
      setSelectedCustomer(selectedRows[0]);
      setIsModalOpen(true);
    } else {
      alert("수정할 고객을 한 명만 선택해주세요.");
    }
  };

  // --- 등록/수정 서브밋 ---
  const handleCustomerSubmit = (customerData) => {
    if (selectedCustomer) {
      // 수정 모드
      console.log("고객 정보 업데이트:", customerData);
      const updatedData = rowData.map(row => 
        row.custNo === customerData.custNo ? customerData : row
      );
      setRowData(updatedData);
    } else {
      // 신규 등록 모드
      console.log("새 고객 등록:", customerData);
      setRowData([...rowData, customerData]);
    }
    closeModal();
  };

  // --- 삭제 기능 ---
  const handleDelete = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("삭제할 고객을 하나 이상 선택해주세요.");
      return;
    }
    
    if (window.confirm(`${selectedRows.length}명의 고객 정보를 삭제하시겠습니까?`)) {
      const selectedIds = selectedRows.map(row => row.custNo);
      const filteredData = rowData.filter(row => !selectedIds.includes(row.custNo));
      setRowData(filteredData);
      alert("삭제되었습니다.");
    }
  }, [rowData]);

  return (
    <div className="page-container">
      <h2>👥 고객 현황 관리</h2>
      
      <div className="list-header">
        <p>고객 리스트를 조회하고 정보를 수정하거나 삭제할 수 있습니다.</p>
        <div>
          <button className="register-button" onClick={handleEdit} style={{marginRight: '10px'}}>
            수정
          </button>
          <button className="register-button" onClick={handleDelete} style={{backgroundColor: '#dc3545', marginRight: '10px'}}>
            삭제
          </button>
          <button className="register-button" onClick={openModal}>
            ➕ 신규 고객
          </button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 600, width: '100%', marginTop: '10px' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}          
          columnDefs={columnDefs}    
          pagination={true}          
          paginationPageSize={15}    
          rowSelection={'multiple'}
          defaultColDef={{ 
            resizable: true, 
            flex: 1,
            minWidth: 100 
          }}
          theme="legacy"
        />
      </div>

      {/* 고객 등록/수정 모달 (통합 운영) */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSubmit={handleCustomerSubmit}
          initialData={selectedCustomer} // 수정 시 데이터 전달, 신규 시 null
          title={selectedCustomer ? "고객 정보 수정" : "신규 고객 등록"}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;
