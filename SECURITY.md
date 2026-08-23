# 🛡️ Security Policy & Compliance Guide — D-Mart Mini Express

---

## 📌 Executive Security Overview

Security and data protection are fundamental to **D-Mart Mini Express**. This document outlines our security baseline, authentication protocols, role-based authorization rules, data protection policies, and vulnerability disclosure procedures.

---

## 🔑 Authentication & Access Control

### 1. Role-Based Access Control (RBAC)
D-Mart Mini Express enforces strict role separation across three user roles:
* **Superadmin**: Full administrative rights across system logs, analytics, user accounts, and product catalog.
* **Store Staff**: Access restricted to order fulfillment, packing checklists, payment verification, and return review queues.
* **Customer**: Scoped access restricted to personal account management, catalog browsing, cart operations, slot booking, and personal order history.

### 2. User Order Isolation & Data Scoping
* Customer Order History (`/orders`) strictly filters API responses by the authenticated user's email address (`user?.email`).
* Customers cannot view, query, or modify order records belonging to another registered user.

---

## 🔒 Data Protection & Cryptographic Standards

### 1. Password Security & Hashing
* Passwords are stored securely using industry-standard password hashing algorithms (PBKDF2 with SHA-256 via Django's authentication framework).
* Plaintext passwords are never logged or stored in persistent storage.

### 2. Database Protection & Row Level Security (RLS)
* **Database Engine**: Hosted on **Supabase PostgreSQL** (`aws-0-ap-southeast-1.pooler.supabase.com`).
* **Connection Security**: All PostgreSQL database connections enforce SSL encryption (`sslmode=require`).
* **Audit Logging**: Sensitive system operations (login attempts, payment status transitions, return approvals, and role updates) are recorded in the `audit_auditlog` table with user IDs, timestamps, and IP addresses.

---

## 🌐 Web Application Security & Headers

D-Mart Mini Express enforces standard security headers across all endpoints:

```python
# Security Headers Baseline (backend/config/settings/base.py)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
```

### CORS Configuration
Cross-Origin Resource Sharing (CORS) is configured to permit authorized requests while preventing unauthorized cross-site data theft.

---

## 📬 Reporting Vulnerabilities

If you discover a security vulnerability or bug in D-Mart Mini Express, please follow our responsible disclosure guidelines:

1. **Contact Email**: Report vulnerabilities to `security@dmartminiexpress.com` or `balaji_admin@gmail.com`.
2. **Details**: Provide a clear description, steps to reproduce, and potential impact.
3. **Disclosure Policy**: Please allow our security team up to 48 hours to investigate and resolve issues before public disclosure.

---

## 📄 Compliance Statement

D-Mart Mini Express complies with standard web security best practices and enterprise security baselines.
