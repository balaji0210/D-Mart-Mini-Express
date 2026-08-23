# 🎤 Mini D-Mart Express — Master Presentation & Live Demo Script

---

## 📌 Document Overview

This document provides a **complete, word-for-word spoken presentation script** and **live screen action guide** for presenting **Mini D-Mart Express**.

* **Live Demo URL**: [https://d-mart-mini-express.vercel.app](https://d-mart-mini-express.vercel.app)
* **GitHub Repository**: [https://github.com/balaji0210/D-Mart-Mini-Express](https://github.com/balaji0210/D-Mart-Mini-Express)

---

## 🔑 1-Click Demo Access Credentials

| Role | Email Address | Password | Primary Purpose in Demo |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@dmart.com` | `Customer@123` | Browsing 16+ categories, dynamic gram/size variants, express slot checkout, order tracking & returns |
| **Store Staff** | `staff@dmart.com` | `Staff@123` | Order preparation queue, visual picking checklist, staging bay assignment, low stock restock, return QC |
| **Superadmin** | `admin@dmart.com` | `Admin@123` | Catalog CRUD, dynamic low stock threshold management, store revenue analytics, RBAC controls, audits |

---

## 🎬 Master Presentation & Live Demo Script (Step-by-Step)

---

### SECTION 1: Welcome & Executive Introduction (1.5 Mins)
**Screen Setup**: Show Homepage of [https://d-mart-mini-express.vercel.app](https://d-mart-mini-express.vercel.app).

#### 🗣️ What to Speak:
> "Good morning/afternoon respected evaluators and panel members. Today, I am excited to present **Mini D-Mart Express** — an enterprise-grade quick-commerce grocery delivery and scheduled store pickup management platform.
>
> In modern grocery retail, two primary bottlenecks exist:
> 1. **Peak-hour counter congestion & inaccurate order picking**
> 2. **Lack of real-time multi-device inventory synchronization**
>
> Mini D-Mart Express solves these challenges with a real-time full-stack cloud platform built across three dedicated role-based portals:
> 1. **The Customer Experience Portal** — Features 16+ grocery categories, dynamic weight/size variant pricing, 10-minute fast cart, and scheduled express pickup slot reservations.
> 2. **The Store Operations Staff Portal** — Powers live picking queues, visual item verification checklists, staging bay slot management, and 1-click fast inventory restocks.
> 3. **The Executive Admin Management Console** — Provides full catalog control, real-time threshold-driven low stock alerts, revenue reports, and security audit logs.
>
> Let me walk you through a live, end-to-end demonstration."

---

### SECTION 2: Customer Storefront & Dynamic Variant Pricing (3.5 Mins)
**Screen Action**: Log in as Customer (`customer@dmart.com` / `Customer@123`). Navigate to `/products`.

#### 🗣️ What to Speak:
> "We begin on the **Customer Storefront**.
>
> On the left side, notice our **Filter & Explore Sidebar**, allowing customers to filter by category counts, price boundaries (with quick filters like $\le ₹50, \le ₹100, \le ₹250$), and in-stock toggles.
>
> On the right side, products are structured in dedicated **Category-wise Sliders** — from *Breakfast & Cereals* and *Cooking Essentials* to *Dairy, Bread & Eggs* and *Fruits & Vegetables*.
>
> **Dynamic Grams & Pack-Size Variant Pricing**:
> Notice what happens when I interact with a product card like *McVities Digestive Biscuits* or *Saffola Muesli*:
> - Selecting **`[ 250 g ]`** shows the base price of **₹67**.
> - Clicking **`[ 500 g ]`** instantly recalculates the price to **₹127** with bundle savings.
> - Clicking **`[ 1 kg ]`** dynamically scales the price to **₹241** with bulk discounts.
>
> Notice also our **Low Inventory Indicators**: If an item falls at or below its safety threshold, the system displays a pulsing amber badge: **`🔥 Only X left in stock!`**
>
> Let's add items to our bag and open the **Floating Cart Bar** (`1 Item in Bag • ₹127`)."

#### 🖱️ Screen Action:
Click **Checkout ->** to open the `/checkout` page. Select a scheduled pickup slot (e.g. `09:00 - 11:00 AM`), choose payment method (UPI / Card / Cash on Delivery), and click **Pay & Place Order**.

#### 🗣️ What to Speak:
> "On our Express Checkout page, customers select a **2-Hour Scheduled Store Pickup Window** or 10-Minute Home Delivery.
>
> Upon clicking **Pay & Place Order**, the platform executes an atomic database transaction:
> 1. Assigns a sequential tracking order code — e.g. **`#DM-10045`**.
> 2. Decrements the physical shelf stock for each item.
> 3. Automatically triggers low-stock alerts if remaining units breach safety limits.
> 4. Instantly clears the shopping bag."

---

### SECTION 3: Store Staff Operations & Picking Desk (3 Mins)
**Screen Action**: Log out $\rightarrow$ Log in as **Staff** (`staff@dmart.com` / `Staff@123`) $\rightarrow$ Navigate to `/staff`.

#### 🗣️ What to Speak:
> "Now let's switch to the **Store Operations Staff Portal**.
>
> Thanks to our **2.5-second Real-Time CloudSync Engine**, Order `#DM-10045` appears instantly in the staff preparation queue without requiring any manual page reload.
>
> Let's click on the order:
> 1. Staff click **`Start Picking`** (order transitions to `PREPARING`).
> 2. Staff check off each item on the **Visual Picking Checklist**.
> 3. Staff assign a designated shelf staging location — for instance, **`Bay A-03`**.
> 4. Staff click **`Mark Ready for Pickup`** (order transitions to `READY`).
>
> When the customer arrives at the store express counter, staff enter the order number, verify the package in `Bay A-03`, and click **`Handover Complete`**."

#### 🖱️ Screen Action:
Navigate to `/staff/alerts` and `/staff/inventory-updates`.

#### 🗣️ What to Speak:
> "In the **Staff Alerts & Restock Center**, staff can monitor all SKUs reaching critical shelf limits. With our **1-Click Restock `[+50 Units]` Action**, staff can replenish inventory on the fly, immediately broadcasting updated stock levels to all active customer devices."

---

### SECTION 4: Admin Management Console & Real-Time Alerts (2.5 Mins)
**Screen Action**: Log in as **Admin** (`admin@dmart.com` / `Admin@123`) $\rightarrow$ Navigate to `/admin/products` and `/admin/reports`.

#### 🗣️ What to Speak:
> "Now, let's enter the **Admin Command Console**.
>
> **1. Low Inventory Alert System**:
> On the Product Administration page, the system features dynamic threshold comparison. If any product's shelf count falls $\le$ its alert threshold, it triggers the top **Low Inventory Alert Banner** with 1-click filter tabs (`Low Stock` & `Out of Stock`).
>
> **2. Superuser Omnichannel Authority**:
> The Admin has full authority to manage catalog prices, adjust stock thresholds, and add products to the cart to place test orders directly from the storefront.
>
> **3. Reports & Analytics**:
> Under `/admin/reports`, admins can review real-time revenue breakdowns, inventory turnover, and export CSV audit logs."

---

### SECTION 5: System Architecture & Technical Summary (1.5 Mins)
**Screen Action**: Navigate to `/architecture`.

#### 🗣️ What to Speak:
> "To summarize our technical foundation:
> - **Frontend**: React 18, Vite, Tailwind CSS, TypeScript, and React Router with role-based access control.
> - **Backend**: Django REST Framework with Argon2 password hashing and Simple JWT.
> - **Persistence**: PostgreSQL cloud database with foreign key integrity, ACID transactions, and `dmart_kv_store` for 2.5-second cross-browser synchronization.
> - **Documentation**: Complete System Architecture, Data Flow Diagrams (DFDs), and PostgreSQL Relational Schema are built into the web app at `/architecture` with 1-click PDF print and Markdown download capabilities.
>
> Thank you. I would be happy to answer any questions from the panel."

---

## 🎯 Viva & Evaluation Q&A Cheat Sheet

| Question | Answer Summary |
| :--- | :--- |
| **Q1: How do you prevent overselling or race conditions during checkout?** | We use database-level atomic transactions with `SELECT ... FOR UPDATE` locking during checkout. Stock is verified and decremented before confirming the order. |
| **Q2: How does the system synchronize data across different browsers?** | Through our `CloudSync` engine combined with the `dmart_kv_store` PostgreSQL JSONB table, polling every 2.5 seconds with multi-level safe deserialization. |
| **Q3: How are dynamic weight/size variant prices calculated?** | Dynamic scaling multipliers (1.0x, 1.9x, 3.6x) are computed in real time on the client and validated on backend order creation. |
| **Q4: How does the return/exchange workflow work?** | Customers can request returns within a 7-day delivery window. Store staff inspect the physical item in the Staff Returns Desk, record QC notes, and approve instant refunds. |
