import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Customer Pages
import { HomePage } from '../pages/customer/HomePage';
import { ProductsPage } from '../pages/customer/ProductsPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { OrderDetailPage } from '../pages/customer/OrderDetailPage';
import { ReturnsPage } from '../pages/customer/ReturnsPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

// Staff Pages
import { StaffDashboardPage } from '../pages/staff/DashboardPage';
import { StaffOrdersPage } from '../pages/staff/OrdersPage';
import { StaffPickupQueuePage } from '../pages/staff/PickupQueuePage';
import { StaffDeliveriesPage } from '../pages/staff/DeliveriesPage';
import { StaffInventoryUpdatesPage } from '../pages/staff/InventoryUpdatesPage';
import { StaffAlertsPage } from '../pages/staff/AlertsPage';
import { StaffMyActivityPage } from '../pages/staff/MyActivityPage';
import { StaffReturnsPage } from '../pages/staff/ReturnsPage';
import { StaffProfilePage } from '../pages/staff/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/DashboardPage';
import { AdminProductsPage } from '../pages/admin/ProductsPage';
import { AdminCategoriesPage } from '../pages/admin/CategoriesPage';
import { AdminInventoryPage } from '../pages/admin/InventoryPage';
import { AdminPickupSlotsPage } from '../pages/admin/PickupSlotsPage';
import { AdminOrdersPage } from '../pages/admin/OrdersPage';
import { AdminCustomersPage } from '../pages/admin/CustomersPage';
import { AdminStaffPage } from '../pages/admin/StaffPage';
import { AdminPaymentsPage } from '../pages/admin/PaymentsPage';
import { AdminReportsPage } from '../pages/admin/ReportsPage';
import { AdminAuditLogsPage } from '../pages/admin/AuditLogsPage';
import { AdminSettingsPage } from '../pages/admin/SettingsPage';

import { FloatingCartBar } from '../components/customer/FloatingCartBar';

const CustomerLayout = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <Outlet />
    </main>
    <FloatingCartBar />
    <Footer />
  </div>
);

const StaffAdminLayout = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public & Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Customer Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="CUSTOMER" />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Staff Dashboard Routes */}
      <Route element={<ProtectedRoute requiredRole={['STAFF', 'ADMIN']} />}>
        <Route element={<StaffAdminLayout />}>
          <Route path="/staff" element={<StaffDashboardPage />} />
          <Route path="/staff/orders" element={<StaffOrdersPage />} />
          <Route path="/staff/pickup-queue" element={<StaffPickupQueuePage />} />
          <Route path="/staff/deliveries" element={<StaffDeliveriesPage />} />
          <Route path="/staff/inventory-updates" element={<StaffInventoryUpdatesPage />} />
          <Route path="/staff/returns" element={<StaffReturnsPage />} />
          <Route path="/staff/alerts" element={<StaffAlertsPage />} />
          <Route path="/staff/my-activity" element={<StaffMyActivityPage />} />
          <Route path="/staff/profile" element={<StaffProfilePage />} />
        </Route>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<StaffAdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/pickup-slots" element={<AdminPickupSlotsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/staff" element={<AdminStaffPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<CustomerLayout />}>
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
              <div className="dmart-card p-8 rounded-3xl border border-slate-200 max-w-md">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">404</h2>
                <p className="text-slate-500 text-sm mb-4">The requested portal page could not be found.</p>
                <a href="/" className="btn-primary">
                  Return Home
                </a>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};
