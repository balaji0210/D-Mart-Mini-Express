# 🛒 Mini D-Mart Express — Full-Stack Grocery E-Commerce & Store Fulfillment System

A full-fledged, real-world Mini D-Mart / Grocery Store web application enabling customers to purchase products, schedule store pickup or home delivery, and manage returns & exchanges. Built with a robust **Django REST Framework** backend, **React 18 + TypeScript + Tailwind CSS** frontend, role-based access control (RBAC), atomic database transactions, audit logging, and automated test coverage.

---

## 🌟 Key Features

### 👤 User Management & RBAC
- **Multi-Role Access**: `CUSTOMER`, `STAFF`, `ADMIN` with JWT Authentication (SimpleJWT).
- **Protected Routes**: Granular permissions (`IsCustomer`, `IsStaff`, `IsAdmin`).
- **Profile Settings**: Customer profile management and activity tracking.

### 🛍️ Product Catalog & Inventory
- **Category & Product Management**: Categorized catalog with search, price filtering, and stock badges.
- **Real-Time Stock Tracking**: Automated stock reservation upon checkout and inventory restoration on cancellation/approved returns.
- **Admin Management**: Full CRUD for products, categories, and inventory stock adjustments.

### 🛒 Cart & Checkout Engine
- **Persistent Cart**: Server-synced shopping cart per customer.
- **Atomic Checkout**: Database row-level locking (`select_for_update`) to prevent race conditions and overselling.
- **Fulfillment Choice**: Store Pickup with slot selection or Home Delivery with address input.
- **Multiple Payment Options**: Cash, Card, UPI, and Wallet payment options.

### 📦 Order Lifecycle & Pickup Queue
- **Auto-Generated Order IDs**: Format `ORD-YYYY-NNNNNN`.
- **Fulfillment Status Pipeline**: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY_FOR_PICKUP` / `OUT_FOR_DELIVERY` ➔ `COMPLETED` / `DELIVERED`.
- **Order Cancellation**: Customer order cancellation releasing reserved stock back to inventory.
- **Staff Fulfillment Desk**: Live staff dashboard for quick status transitions and pickup queues.

### 🔄 Return & Refund Management
- **Item-Level Returns**: 7-day return/refund eligibility window for delivered/completed orders.
- **Request Options**: Return for Refund (`RETURN`) or Product Exchange (`EXCHANGE`).
- **Staff Review Queue**: Staff can approve/accept returns or reject with mandatory explanation notes.
- **Prominent Visual Badges**: Real-time status banners on customer order cards (`RETURN ACCEPTED`, `PENDING REVIEW`, `RETURN REJECTED`).

### 🛡️ Security & Audit Logging
- **Audit Logs**: Automatic logging of authentication events, order checkouts, status changes, returns, and inventory modifications.
- **Input Validation**: Django REST Framework serializers enforcing strict validation.
- **OpenAPI / Swagger Specs**: Interactive API documentation at `/api/v1/docs/`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Python 3.14 + Django 5.0 + Django REST Framework |
| **Authentication** | djangorestframework-simplejwt (JWT) |
| **API Documentation** | drf-spectacular (OpenAPI 3.0 / Swagger UI) |
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Lucide React Icons |
| **Database** | PostgreSQL / SQLite3 |
| **Containerization** | Docker & Docker Compose |
| **Testing** | Pytest + Pytest-Django |

---

## 📁 Repository Structure

```
SecurityBoat/
├── backend/
│   ├── apps/
│   │   ├── accounts/          # User authentication & RBAC models
│   │   ├── audit/             # Audit logging & security tracking
│   │   ├── cart/              # Cart & item management
│   │   ├── operations/        # Pickup slots & store operations
│   │   ├── orders/            # Order creation, checkout & lifecycle
│   │   ├── products/          # Catalog, categories & stock
│   │   └── returns_exchange/  # Return & refund request engine
│   ├── config/                # Django settings & URLs
│   ├── manage.py
│   ├── pytest.ini
│   └── requirements/
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios API clients
│   │   ├── components/        # Layout, Navigation & UI Modals
│   │   ├── context/           # Auth & Cart Context Providers
│   │   ├── pages/             # Customer, Staff & Admin views
│   │   ├── routes/            # React Router protected routes
│   │   └── types/             # TypeScript type declarations
│   ├── package.json
│   └── vite.config.ts
├── docker/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
python manage.py migrate

# Start Django development server
python manage.py runserver 8000
```

The Django API server will run at `http://127.0.0.1:8000/`.
- Swagger API Docs: `http://127.0.0.1:8000/api/v1/docs/`
- Redoc API Docs: `http://127.0.0.1:8000/api/v1/redoc/`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The React frontend application will run at `http://localhost:5173/`.

---

## 🐳 Docker Deployment

To launch the entire application stack (PostgreSQL, Redis, Django Backend, Vite Frontend) using Docker Compose:

```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

### Backend Unit Tests (Pytest)

```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

### Frontend Type Check & Build

```bash
cd frontend
npm run build
```

---

## 🔐 Environment Variables (`.env.example`)

```env
DEBUG=True
SECRET_KEY=dev_secret_key_mini_dmart_2026
DATABASE_URL=postgres://postgres:dev_password@localhost:5432/mini_dmart
REDIS_URL=redis://localhost:6379/0
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 📄 License

Distributed under the MIT License.
