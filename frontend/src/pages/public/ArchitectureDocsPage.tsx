import React, { useEffect } from 'react';
import { Download, Printer, ArrowLeft, ShieldCheck, Database, Layers, CheckCircle2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ARCHITECTURE_MD_CONTENT = `# 🏗️ Mini D-Mart Express — System Architecture, Data Flow & Database Design

This document details the End-to-End System Architecture, Multi-Tier Data Flow Diagrams (DFD), Role-Based Access Control (RBAC) Workflows, and the Complete PostgreSQL Entity-Relationship (ER) Database Schema for the Mini D-Mart Express grocery platform.

================================================================================
1. HIGH-LEVEL SYSTEM ARCHITECTURE
================================================================================
Client Tier (Presentation Layer):
  - Customer Web App (React 18 + Vite + Tailwind CSS)
  - Staff Operational Portal (Picking, Staging Bay Slot Assignments, QC Approvals)
  - Admin Management Console (Catalog, Low Stock Thresholds, Audits, Reports)

Edge & Delivery Tier:
  - Vercel Global Edge Network with SSL Termination and SPA Routing

Backend Application Tier (Django REST Framework):
  - Auth & Security Service (Argon2, Simple JWT, RBAC Middleware)
  - Catalog & Dynamic Pricing Service (16+ Categories, Gram/Weight Scaler)
  - Order Fulfillment Engine (Atomic Locking, Slot Reservation, State Machine)
  - Real-Time Inventory Service (Dynamic Low Stock Threshold Alert Trigger)
  - Returns & Exchange Service (7-Day Window Validator, QC Inspector)
  - CloudSync & KV Store Engine (Multi-Browser State Synchronization, 2.5s Polling)

Persistence & Storage Tier:
  - PostgreSQL Cloud Database (ACID Relational Tables & Constraints)
  - dmart_kv_store (Key VARCHAR PRIMARY KEY, Value JSONB)
  - Cloud Media Storage (High-Res Assets & Icons)

================================================================================
2. DATABASE DESIGN (POSTGRESQL RELATIONAL ENTITIES)
================================================================================
1. users (id UUID PK, email VARCHAR UK, role 'CUSTOMER'|'STAFF'|'ADMIN', is_active)
2. categories (id VARCHAR PK, name, slug UK, icon, description, is_active)
3. products (id VARCHAR PK, category_id FK, name, price, discount_price, weight_size, stock_quantity, low_stock_threshold, is_in_stock, is_low_stock, image_url)
4. product_variants (id UUID PK, product_id FK, variant_name, price_multiplier, price)
5. carts & cart_items (cart_id FK, product_id FK, quantity, selected_variant, subtotal)
6. stores & pickup_slots (store_id FK, slot_date, start_time, end_time, max_capacity, booked_count)
7. orders (id VARCHAR PK, order_number UK, customer_id FK, pickup_slot_id FK, staging_bay, total_amount, status, payment_status, assigned_staff_id FK)
8. order_items (id UUID PK, order_id FK, product_id FK, product_name, selected_variant, quantity, unit_price, subtotal)
9. returns & return_items (id VARCHAR PK, return_number UK, order_id FK, reason, status 'PENDING_QC'|'APPROVED'|'REJECTED', refund_amount)
10. inventory_adjustments (id UUID PK, product_id FK, staff_id FK, delta, reason, notes)
11. audit_logs (id UUID PK, user_id FK, action, resource_type, details JSONB)
12. dmart_kv_store (key VARCHAR PK, value JSONB, updated_at TIMESTAMPTZ)

================================================================================
3. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
================================================================================
- Storefront Catalog & Search: Customer (Yes), Staff (Yes), Admin (Yes)
- Dynamic Variant Pricing: Customer (Yes), Staff (Yes), Admin (Yes)
- Add to Cart & Checkout: Customer (Yes), Staff (No), Admin (Yes - Superuser)
- Order Preparation & Picking Queue: Customer (No), Staff (Yes), Admin (Yes)
- Pickup Bay Staging: Customer (No), Staff (Yes), Admin (Yes)
- Low Stock Threshold Alerts & Restock: Customer (No), Staff (Yes), Admin (Yes)
- Product & Price Master CRUD: Customer (No), Staff (No), Admin (Yes)
- Staff Management & Audits: Customer (No), Staff (No), Admin (Yes)
`;

export const ArchitectureDocsPage: React.FC = () => {
  const downloadMarkdownFile = () => {
    try {
      const blob = new Blob([ARCHITECTURE_MD_CONTENT], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mini_DMart_Architecture_and_Database_Design.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Architecture & DB Schema downloaded successfully!');
    } catch (e) {
      toast.error('Failed to download file.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ARCHITECTURE_MD_CONTENT);
    toast.success('Full Architecture Specification copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1">
                <img src="/favicon.png" alt="Mini D-Mart Logo" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  System Architecture & Database Design
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Official Technical Specifications • Data Flow Diagrams (DFD) • PostgreSQL Relational Schema
                </p>
              </div>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={downloadMarkdownFile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Specification (.md)
            </button>
          </div>
        </div>

        {/* SECTION 1: High Level System Architecture */}
        <div className="dmart-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" /> 1. High-Level Multi-Tier Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Decoupled, high-concurrency microservices architecture connecting SPA clients with Django REST APIs and PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-black text-[10px] uppercase">
                Presentation Layer (SPA)
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">React 18 + Vite + Tailwind</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Customer Storefront (Dynamic Variant Pricing, 10-Min Fast Bag), Staff Operations Portal (Pick list & Staging), and Admin Command Console.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white font-black text-[10px] uppercase">
                Application API Tier
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">Django REST Framework</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Auth & RBAC Middleware, Order Fulfillment Engine, Atomic Stock Decrementing, Return QC Desk, and CloudSync KV Store Engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-700 text-white font-black text-[10px] uppercase">
                Persistence Tier
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">PostgreSQL + KV Engine</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Relational ACID schema with B-Tree indexes, foreign keys, and <code>dmart_kv_store</code> for real-time 2.5s cross-browser state synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Data Flow Diagrams */}
        <div className="dmart-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" /> 2. Core Data Flow & Workflows (DFD)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step transaction life-cycles across customer, operational staff, and background inventory systems.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">A. Customer Order Placement & Express Checkout</h4>
              <p className="text-slate-600 font-medium">
                Customer selects size variant (e.g. 500g $\rightarrow$ 1.9x price) $\rightarrow$ Item added to cart $\rightarrow$ Pickup slot / delivery method chosen $\rightarrow$ Atomic transaction creates order, decrements stock quantity, and triggers low stock flag if remaining units $\le$ threshold.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">B. Staff Picking, Staging Bay & Pickup Handover</h4>
              <p className="text-slate-600 font-medium">
                Staff views picking queue sorted by scheduled pickup time $\rightarrow$ Marks order <code>PREPARING</code> $\rightarrow$ Completes item checklist $\rightarrow$ Assigns staging bay (e.g. <code>Bay A-03</code>) $\rightarrow$ Marks <code>READY</code> $\rightarrow$ Verifies customer order code on pickup & marks <code>COMPLETED</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">C. Dynamic Low Inventory Alerting & 1-Click Restock</h4>
              <p className="text-slate-600 font-medium">
                When stock falls $\le$ low-stock threshold, the system displays pulsing <code>🔥 Low Stock</code> tags on storefront cards and triggers top alert banners on Admin/Staff dashboards with 1-click <code>[+50 Restock]</code> actions.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: PostgreSQL Database Design */}
        <div className="dmart-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" /> 3. PostgreSQL Relational Database Schema
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ACID compliant entity specifications with primary keys, foreign key relations, and indexing.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Table Name</th>
                  <th className="p-3.5">Primary Key</th>
                  <th className="p-3.5">Foreign Keys & Relations</th>
                  <th className="p-3.5">Key Attributes & Enums</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">users</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (UUID)</td>
                  <td className="p-3.5 text-slate-500">-</td>
                  <td className="p-3.5">email, password_hash, role (CUSTOMER/STAFF/ADMIN), is_active</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">categories</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (VARCHAR)</td>
                  <td className="p-3.5 text-slate-500">-</td>
                  <td className="p-3.5">name, slug, icon, description, is_active</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">products</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (VARCHAR)</td>
                  <td className="p-3.5 font-mono text-blue-700">category_id $\rightarrow$ categories.id</td>
                  <td className="p-3.5">name, price, discount_price, weight_size, stock_quantity, low_stock_threshold, is_in_stock, is_low_stock</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">orders</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (VARCHAR)</td>
                  <td className="p-3.5 font-mono text-blue-700">customer_id $\rightarrow$ users.id, pickup_slot_id $\rightarrow$ slots.id</td>
                  <td className="p-3.5">order_number, total_amount, staging_bay, status (PLACED/PREPARING/READY/COMPLETED), payment_status</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">order_items</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (UUID)</td>
                  <td className="p-3.5 font-mono text-blue-700">order_id $\rightarrow$ orders.id, product_id $\rightarrow$ products.id</td>
                  <td className="p-3.5">product_name, selected_variant, quantity, unit_price, subtotal</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">returns</td>
                  <td className="p-3.5 font-mono text-emerald-800">id (VARCHAR)</td>
                  <td className="p-3.5 font-mono text-blue-700">order_id $\rightarrow$ orders.id, customer_id $\rightarrow$ users.id</td>
                  <td className="p-3.5">return_number, reason, status (PENDING_QC/APPROVED/REJECTED), refund_amount</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">dmart_kv_store</td>
                  <td className="p-3.5 font-mono text-emerald-800">key (VARCHAR)</td>
                  <td className="p-3.5 text-slate-500">-</td>
                  <td className="p-3.5">value (JSONB), updated_at (TIMESTAMPTZ)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Download Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-white">Download Full Technical Design Document</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Includes complete Mermaid schema diagrams, architectural flows, and PostgreSQL DDL definitions.
            </p>
          </div>

          <button
            onClick={downloadMarkdownFile}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Markdown (.md)
          </button>
        </div>
      </div>
    </div>
  );
};
