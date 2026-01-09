import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/BarcodeOrderModal.css'; 

const BarcodeOrderModal = ({ isOpen, onClose, onOrderComplete }) => {
  // --- [데이터 관리] 상품 마스터 ---
  const [productMaster] = useState([
    { code: 'P001', name: '아메리카노', price: 4500 },
    { code: 'P002', name: '카페라떼', price: 5000 },
    { code: 'P003', name: '치즈케이크', price: 6500 },
    { code: 'P004', name: '텀블러', price: 15000 },
  ]);

  // --- [데이터 관리] 고객 마스터 (검색용) ---
  const [customerList] = useState([
    { name: '홍길동', phone: '1234' },
    { name: '김철수', phone: '5678' },
    { name: '이영희', phone: '4444' },
    { name: '박지민', phone: '1111' },
  ]);

  const [barcode, setBarcode] = useState("");
  const [cartData, setCartData] = useState([]);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);

  // --- 고객 찾기 관련 상태 ---
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [manualData, setManualData] = useState({ selectedCode: '', prodName: '', price: '', qty: 1 });
  const inputRef = useRef(null);

   // --- 실시간 고객 찾기 로직 ---
  useEffect(() => {
    if (searchPhone.length === 4) {
      const found = customerList.find(c => c.phone === searchPhone);
      if (found) {
        setSelectedCustomer(found.name);
      } else {
        setSelectedCustomer("미등록고객");
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [searchPhone, customerList]);

  // --- 장바구니 추가/합산 로직 ---
  const addProductToCart = (name, price, qty) => {
    setCartData(prevCart => {
      // 1. 장바구니에 이미 동일한 상품명이 있는지 확인
      const existingItemIndex = prevCart.findIndex(item => item.prodName === name);

      if (existingItemIndex > -1) {
        // 2. 이미 있다면 해당 항목의 수량만 업데이트 (불변성 유지)
        const updatedCart = [...prevCart];
        const currentItem = updatedCart[existingItemIndex];
        
        updatedCart[existingItemIndex] = {
          ...currentItem,
          qty: Number(currentItem.qty) + Number(qty)
        };
        return updatedCart;
      } else {
        // 3. 없다면 새로운 항목으로 추가
        const newItem = {
          id: Date.now(),
          prodName: name,
          qty: Number(qty) || 1,
          price: Number(price) || 0,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleCodeChange = (e) => {
    const selectedCode = e.target.value;
    const product = productMaster.find(p => p.code === selectedCode);
    if (product) {
      setManualData({
        ...manualData,
        selectedCode: product.code,
        prodName: product.name,
        price: product.price
      });
    } else {
      setManualData({ ...manualData, selectedCode: '', prodName: '', price: '' });
    }
  };

  const columnDefs = [
    { headerName: "상품명", field: "prodName", flex: 2 },
    { headerName: "수량", field: "qty", flex: 1, editable: true },
    { 
      headerName: "단가", 
      field: "price", 
      flex: 1, 
      valueFormatter: params => params.value.toLocaleString() + "원" 
    },
    { 
      headerName: "합계", 
      valueGetter: params => Number(params.data.qty) * Number(params.data.price),
      flex: 1,
      valueFormatter: params => params.value.toLocaleString() + "원" 
    }
  ];

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcode) return;
    const product = productMaster.find(p => p.code === barcode);
    if (product) {
      addProductToCart(product.name, product.price, 1); // 1개 합산
    } else {
      addProductToCart(`알수없는상품(${barcode})`, 0, 1);
    }
    setBarcode("");
    inputRef.current.focus();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualData.prodName || !manualData.price || !manualData.qty) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    addProductToCart(manualData.prodName, manualData.price, manualData.qty); // 입력된 수량만큼 합산
    setManualData({ selectedCode: '', prodName: '', price: '', qty: 1 });
    setIsManualInputOpen(false);
  };

  const handlePayment = () => {
    const totalAmount = cartData.reduce((acc, cur) => acc + (Number(cur.qty) * Number(cur.price)), 0);
    if (totalAmount === 0) return alert("상품이 없습니다.");

    // --- [추가/수정 코드 시작] ---
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 부모 그리드(OrderListPage)에 전달할 객체 생성
    const newOrder = {
      orderId: "ORD" + Date.now().toString().slice(-4), // 2025년 기준 유니크 번호 생성
      orderTime: formattedDate,
      // 선택된 고객이 있으면 해당 이름 사용
      customerName: selectedCustomer && selectedCustomer !== "미등록고객" ? selectedCustomer : "익명",
      amount: totalAmount,
      paymentMethod: "카드결제",
      status: "완료"
    };

    if (onOrderComplete) {
      onOrderComplete(newOrder); // 부모의 setRowData 실행
    }
    // --- [추가/수정 코드 끝] ---

    alert(`총 ${totalAmount.toLocaleString()}원 결제가 완료되었습니다.`);
    setCartData([]);
    setSearchPhone(""); // 상태 초기화
    onClose();
  };


  useEffect(() => {
    if (isOpen && !isManualInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isManualInputOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-order">
        <div className="modal-header-order">
          <h3>🛒 주문하기 (장바구니)</h3>
          <button onClick={onClose} className="close-btn-order">X</button>
        </div>

        {/* --- [추가] 고객 찾기 영역 --- */}
        <div className="customer-find-section" style={{ padding: '10px', backgroundColor: '#f1f3f9', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>👤 고객찾기 (뒷4자리)</span>
            <input 
              type="text" 
              maxLength="4"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0000"
              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}
            />
          </div>
          <div style={{ flex: 1.5, height: '50px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '18px' }}>
            <span style={{ fontWeight: 'bold', color: selectedCustomer === '미등록고객' ? '#ff4d4f' : '#000C7B' }}>
              {selectedCustomer ? `${selectedCustomer}` : "번호를 입력하세요"}
            </span>
          </div>
        </div>
        

        <div className="scan-section-order">
          <div className="scan-btn-group">
            <button type="button" onClick={() => inputRef.current.focus()} className="barcode-btn">🔍 바코드 스캔</button>
            <button type="button" onClick={() => setIsManualInputOpen(true)} className="manual-btn">⌨️ 수기 입력</button>
          </div>
          
          <form onSubmit={handleBarcodeSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="barcode-hidden-input"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="바코드 기기 대기 중..."
            />
          </form>
        </div>

        {isManualInputOpen && (
          <div className="manual-layer-order">
            <h4 style={{ marginTop: 0 }}>📝 상품 정보 직접 입력</h4>
            <form onSubmit={handleManualSubmit}>
              <div className="input-group-order">
                <label className="label-order">상품코드 선택</label>
                <select 
                  className="manual-input-field"
                  value={manualData.selectedCode}
                  onChange={handleCodeChange}
                  autoFocus
                >
                  <option value="">-- 코드를 선택하세요 --</option>
                  {productMaster.map(p => (
                    <option key={p.code} value={p.code}>[{p.code}] {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group-order">
                <label className="label-order">상품명 (자동입력)</label>
                <input 
                  type="text" 
                  className="manual-input-field"
                  value={manualData.prodName}
                  readOnly 
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>
              <div className="input-group-order">
                <label className="label-order">단가 (원)</label>
                <input 
                  type="number" 
                  className="manual-input-field"
                  value={manualData.price}
                  onChange={(e) => setManualData({...manualData, price: e.target.value})}
                />
              </div>
              <div className="input-group-order">
                <label className="label-order">수량 (개)</label>
                <input 
                  type="number" 
                  className="manual-input-field"
                  value={manualData.qty}
                  onChange={(e) => setManualData({...manualData, qty: e.target.value})}
                  min="1"
                />
              </div>
              <div className="btn-group-manual">
                <button type="submit" className="add-cart-btn">장바구니 추가</button>
                <button type="button" onClick={() => setIsManualInputOpen(false)} className="cancel-manual-btn">취소</button>
              </div>
            </form>
          </div>
        )}

        <div className="ag-theme-alpine" style={{ height: '250px', width: '100%', marginTop: '15px' }}>
          <AgGridReact
            rowData={cartData}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true }}
            theme="legacy"
          />
        </div>

        <div className="modal-footer-order">
          <div className="total-summary">
            합계: <span className="total-price-text">
              {cartData.reduce((acc, cur) => acc + (Number(cur.qty) * Number(cur.price)), 0).toLocaleString()}원
            </span>
          </div>
          <button onClick={handlePayment} className="pay-execute-btn">💳 결제하기</button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeOrderModal;
