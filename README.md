# 🛒 D-Mart Mini Express — Enterprise Grocery E-Commerce & Pickup Platform

[![Live App](https://img.shields.io/badge/Vercel-Live%20App-000000?style=for-the-badge&logo=vercel)](https://d-mart-mini-express.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/balaji0210/D-Mart-Mini-Express)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

**D-Mart Mini Express** is an enterprise grocery e-commerce and express store pickup platform. Built with **React (Vite + TypeScript)**, **Django REST Framework**, and **Supabase PostgreSQL**, it provides real-time multi-browser cloud data synchronization, dynamic pickup slot management, sequential order numbering, role-based dashboards, and automated cart clearance.

---

## 🔑 Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Superadmin** | `balaji_admin@gmail.com` | `Admin@123` | Analytics, Audit Logs, Category & Product CRUD |
| **Store Staff** | `staff@dmart.com` | `Staff@123` | Order Fulfillment Queue, Item Checklists, Payment Status |
| **Customer** | `customer@dmart.com` | `Customer@123` | Catalog, Cart, Slot Reservation, Order History & Returns |

---

## ✨ Features & Engineering Highlights

* **🔢 Sequential Order IDs**: Order numbers follow a clean 6-digit zero-padded sequence starting from `#ORD-2026-000101` (`#ORD-2026-000102`, `#ORD-2026-000103`...).
* **🔒 User-Specific Order Scoping**: Customer order history (`/orders`) strictly displays orders matching `user.email`.
* **⏱️ Live Pickup Slot Capacity**: Store pickup slots dynamically calculate available capacity ($\text{Available} = \text{Capacity} - \text{Active Orders}$) and release capacity upon order cancellation.
* **🏷️ Inclusive Pricing**: Product prices are inclusive of all taxes; checkout displays exact totals without unexpected tax surcharges.
* **🛒 Cart Clearance**: Shopping cart is automatically cleared upon completing checkout and selecting a payment option.
* **📂 Persistent Categories & Products**: New categories and products persist reliably across refreshes and browser sessions.
* **📊 Revenue Integrity**: Admin revenue analytics automatically exclude `CANCELLED` and `REFUNDED` orders.
* **🌐 Cross-Browser Real-Time Sync**: Synchronizes orders, accounts, categories, and products across **Chrome, Firefox, Safari, Edge, Incognito, and Mobile devices** via Supabase PostgreSQL and 3.5s live polling.

---

## 🛠️ Quick Setup Guide

### 1. Clone & Install
```bash
git clone https://github.com/balaji0210/D-Mart-Mini-Express.git
cd D-Mart-Mini-Express/frontend
npm install
npm run dev
```

### 2. Live URLs
* **Vercel Web App**: [https://d-mart-mini-express.vercel.app](https://d-mart-mini-express.vercel.app)
* **GitHub Repository**: [https://github.com/balaji0210/D-Mart-Mini-Express](https://github.com/balaji0210/D-Mart-Mini-Express)

---

## 📄 License

Maintained for D-Mart Mini Express Enterprise Application.
