// src/routes/AuthenticatedRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

// 페이지들 임포트
import DashboardPage from '../pages/DashboardPage';
import OrderListPage from '../pages/OrderListPage';
import PaymentHistoryPage from '../pages/PaymentHistoryPage';
import ProductManagementPage from '../pages/ProductManagementPage';
import InventoryStatusPage from '../pages/InventoryStatusPage';
import VendorListPage from '../pages/VendorListPage';
import CodeManagementPage from '../pages/CodeManagementPage';
import SystemSettingsPage from '../pages/SystemSettingsPage';
import DailySettlementPage from '../pages/DailySettlementPage';
import MonthlySettlementPage from '../pages/MonthlySettlementPage';
import CustomerManagementPage from '../pages/CustomerManagementPage';
import LogoutPage from '../pages/LogoutPage';

const AuthenticatedRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/statistic/dashboard" element={<DashboardPage />} />
        <Route path="/orders/list" element={<OrderListPage />} />
        <Route path="/orders/payments" element={<PaymentHistoryPage />} /> 
        <Route path="/items/products" element={<ProductManagementPage />} />
        <Route path="/items/inventory" element={<InventoryStatusPage />} />
        <Route path="/vendor/list" element={<VendorListPage />} />
        <Route path="/codes" element={<CodeManagementPage />} />
        <Route path="/settle/day" element={<DailySettlementPage />} />
        <Route path="/settle/month" element={<MonthlySettlementPage />} />
        <Route path="/customer/list" element={<CustomerManagementPage />} />
        <Route path="/settings" element={<SystemSettingsPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Layout>
  );
};

export default AuthenticatedRoutes;
