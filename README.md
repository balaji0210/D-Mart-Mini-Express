# 🛒 D-Mart Mini Express — Enterprise Grocery E-Commerce & Pickup Platform

[![Live App](https://img.shields.io/badge/Vercel-Live%20App-000000?style=for-the-badge&logo=vercel)](https://d-mart-mini-express.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/balaji0210/D-Mart-Mini-Express)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

**D-Mart Mini Express** is an enterprise-grade grocery e-commerce and express store pickup management platform. Built with **React 18 (Vite + TypeScript)**, **Django REST Framework**, and **Supabase PostgreSQL**, it delivers real-time multi-browser cloud data synchronization, dynamic pickup slot management, sequential order numbering, role-based operational desks, and automated cart clearance.

---

## 🔑 Login Credentials Matrix

| Role | Email Address | Password | Access & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Superadmin** | `balaji_admin@gmail.com` | `Admin@123` | Revenue analytics, audit logs, category & product management |
| **Store Staff** | `staff@dmart.com` | `Staff@123` | Fulfillment queue, item checklists, payment collection & returns review |
| **Customer** | `customer@dmart.com` | `Customer@123` | Product catalog, express slot booking, checkout, order history & return requests |

---

## ✨ Features & Engineering Highlights

* **🔢 Sequential Order IDs**: Assigns a 6-digit zero-padded Order ID starting from `#ORD-2026-000101` (`#ORD-2026-000102`, `#ORD-2026-000103`...).
* **🔒 User-Specific Order Isolation**: Customer order history (`/orders`) strictly displays orders belonging to the logged-in customer (`user?.email`), maintaining role-based privacy.
* **⏱️ Dynamic Pickup Time Slot Capacity**: Slot availability decrements live ($\text{Available} = \text{Capacity} - \text{Active Orders}$) and releases capacity upon order cancellation.
* **🏷️ Transparent Inclusive Pricing**: Product prices include all taxes; checkout displays exact totals without unexpected tax surcharges.
* **🛒 Automated Cart Clearance**: Shopping cart is automatically cleared upon completing checkout and selecting a payment option.
* **📂 Persistent Categories & Products**: New categories and products persist reliably across refreshes and browser sessions.
* **📊 Revenue Calculation Integrity**: Executive dashboard automatically excludes `CANCELLED` and `REFUNDED` orders from total revenue calculations.
* **🛡️ Complete Return Request Transparency**: Return requests display full **Order ID**, **Product Name**, **Quantity & Price**, **Customer Details**, and **Submission Date**.
* **🌐 Cross-Browser Real-Time Sync**: Synchronizes orders, registered accounts, categories, and products across **Chrome, Firefox, Safari, Edge, Incognito, and Mobile devices** via Supabase PostgreSQL and 3.5s live polling.

---

## 🛠️ Local Setup & Running Instructions

### 1. Clone & Frontend Setup
```bash
git clone https://github.com/balaji0210/D-Mart-Mini-Express.git
cd D-Mart-Mini-Express/frontend
npm install
npm run dev
```
The frontend development server starts at `http://localhost:5173`.

### 2. Backend Setup (Optional Local API)
```bash
cd D-Mart-Mini-Express/backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

---

## 🌐 Production Cloud Architecture

* **Live Web App**: [https://d-mart-mini-express.vercel.app](https://d-mart-mini-express.vercel.app)
* **Backend Runtime**: Vercel Serverless Functions (`@vercel/python` + `@vercel/static-build`)
* **Cloud Database**: Supabase PostgreSQL (`aws-0-ap-southeast-1.pooler.supabase.com`)

---

## 📄 License & Maintainer

Maintained for D-Mart Mini Express Enterprise Application.
