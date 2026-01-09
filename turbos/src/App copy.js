// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import OrderListPage from './pages/OrderListPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ProductManagementPage from './pages/ProductManagementPage';
import InventoryStatusPage from './pages/InventoryStatusPage';
import VendorListPage from './pages/VendorListPage';
import CodeManagementPage from './pages/CodeManagementPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import DailySettlementPage from './pages/DailySettlementPage';
import MonthlySettlementPage from './pages/MonthlySettlementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import LoginPage from './pages/LoginPage';


/* 주석 */

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/orders/list" element={<OrderListPage />} />
          <Route path="/orders/payments" element={<PaymentHistoryPage />} /> 
          <Route path="/items/products" element={<ProductManagementPage />} />
          <Route path="/items/inventory" element={<InventoryStatusPage />} />
          <Route path="/vendor/list" element={<VendorListPage />} />
          <Route path="/codes" element={<CodeManagementPage />} />
          <Route path="/settle/day" element={<DailySettlementPage />} />
          <Route path="/settle/month" element={<MonthlySettlementPage />} />
          <Route path="/customer/list" element={<CustomerManagementPage />} />
          <Route path="/statistic/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SystemSettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
