# 🛒 D-Mart Mini Express — System Documentation & Technical Guide

---

## 📌 Executive Summary

**D-Mart Mini Express** is an enterprise-grade grocery e-commerce and express store pickup platform built with a high-performance **React (Vite + TypeScript + Vanilla CSS)** frontend, a **Django REST Framework** backend, and a cloud-hosted **Supabase PostgreSQL** database.

The platform provides role-based interfaces for **Customers**, **Store Fulfillment Staff**, and **Store Administrators**, with real-time multi-browser cloud synchronization, dynamic pickup slot management, sequential order numbering, and automated cart clearance.

* **Live Application URL**: [https://d-mart-mini-express.vercel.app](https://d-mart-mini-express.vercel.app)
* **GitHub Repository**: [https://github.com/balaji0210/D-Mart-Mini-Express](https://github.com/balaji0210/D-Mart-Mini-Express)

---

## 🔑 User Roles & Access Credentials

The platform enforces strict Role-Based Access Control (RBAC) across three distinct user roles:

| Role | Primary Functions | Login Email | Default Password |
| :--- | :--- | :--- | :--- |
| **Superadmin** | Executive dashboard, revenue analytics, audit logs, category & product management | `balaji_admin@gmail.com` | `Admin@123` |
| **Store Staff** | Fulfillment queue, order checklist verification, payment status updates, pickup verification | `staff@dmart.com` | `Staff@123` |
| **Customer** | Catalog browsing, cart management, slot selection, order placement, order history & return requests | `customer@dmart.com` *(or self-registered)* | `Customer@123` |

---

## ✨ Key Feature Implementation & Problem Resolutions

### 1. 🔢 Sequential Order ID Generation
* **Behavior**: Order IDs follow a clean 6-digit zero-padded sequential sequence starting from `#ORD-2026-000101` (`#ORD-2026-000102`, `#ORD-2026-000103`, etc.).
* **Implementation**: `getNextOrderNumber()` inspects active order numbers, identifies the highest sequential index, and increments by 1. Pre-existing orders are preserved without modification.

### 2. 🔒 User-Specific Order Isolation
* **Behavior**: Customers can view **only their own placed orders** under `/orders`. Other customers cannot see or access another user's order history.
* **Implementation**: `OrdersPage.tsx` passes `customer_email: user?.email` to `ordersApi.getOrders()`, filtering orders strictly by the logged-in customer's email. Staff and Admin portals maintain full access across all store orders.

### 3. ⏱️ Dynamic Pickup Time Slot Capacity Decrement
* **Behavior**: Time slot availability decrements in real time upon order placement (e.g. `13 / 15 Slots Available` $\rightarrow$ `12 / 15 Slots Available`). Cancelling an order automatically releases reserved slot capacity.
* **Implementation**: `getSharedPickupSlots()` calculates live bookings dynamically:
  $$\text{Booked} = \text{Base Booked} + \text{Count of Active Orders for Slot}$$
  $$\text{Available} = \max(0, \text{Capacity} - \text{Booked})$$

### 4. 🏷️ Inclusive Tax Pricing Display
* **Behavior**: The 5% additional tax surcharge was removed from the checkout calculation. Product prices are inclusive of all taxes, so an item priced at ₹71.00 yields a **Final Total of ₹71.00**.
* **Implementation**: `CheckoutPage.tsx` calculates $\text{Final Total} = \text{Items Subtotal}$ and displays `Taxes & Fees: Included (₹0.00 extra)`.

### 5. 🛒 Auto-Clear Cart Upon Order Placement
* **Behavior**: Proceeding through checkout and opting for payment automatically clears all items from the shopping cart.
* **Implementation**: `ordersApi.checkout()` executes `await cartApi.clearCart()` upon order confirmation.

### 6. 📂 Persistent Products & Categories Management
* **Behavior**: Newly created categories and products persist reliably across browser refreshes and browser sessions.
* **Implementation**: Integrated `getSharedCategories()`, `saveSharedCategories()`, `getSharedProducts()`, and `saveSharedProducts()` backed by Supabase cloud storage.

### 7. 🛡️ Audit Logs Blank Screen Crash Fix
* **Behavior**: Resolved blank page crashes when viewing the Audit Logs tab in Admin Desk.
* **Implementation**: Added type guards (`getUserName`, `getUserEmail`, `getUserRole`) in `AuditLogsPage.tsx` to handle string, object, and null log user fields safely.

### 8. 📊 Revenue Calculation & Order Cancellation Sync
* **Behavior**: Cancelled and refunded orders are excluded from total revenue metrics in the Admin Dashboard.
* **Implementation**: `AdminDashboardPage.tsx` filters out `CANCELLED` and `REFUNDED` status orders from `totalRevenue` and polls for live status changes every 2.5 seconds.

### 9. 🌐 Cross-Browser & Cross-Device Real-Time Cloud Synchronization
* **Behavior**: Order placement, category edits, user registrations, and order status updates sync live across **Chrome, Firefox, Safari, Edge, Incognito, and Mobile devices**.
* **Implementation**: Configured root `package.json`, `requirements.txt`, and `vercel.json` routes targeting `@vercel/python`. Built `cloudSync.ts` backed by `dmart_kv_store` in Supabase PostgreSQL with 3.5s live polling.
