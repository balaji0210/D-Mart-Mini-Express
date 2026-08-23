# 🤖 AI Usage & Technology Acknowledgments Statement

---

## 📌 Executive Summary

The development of **D-Mart Mini Express** leveraged modern artificial intelligence tools across product planning, technical architecture, prompt engineering, and autonomous codebase development. Each AI tool was strategically integrated into specific phases of the software development lifecycle (SDLC) to ensure enterprise quality, rapid iteration, and technical rigor.

---

## 🛠️ AI Tools Summary & Utilization Breakdown

| AI Tool / Agent | Primary Purpose | Lifecycle Phase | Key Contributions & Usage Details |
| :--- | :--- | :--- | :--- |
| **Google Antigravity** | Agentic IDE & Autonomous Full-Stack Development | Development, Debugging, Deployment | Full-stack pair programming, React TypeScript frontend & Django REST Framework backend coding, Supabase PostgreSQL database integration, cross-browser cloud sync (`cloudSync.ts`), automated build verification (`npm run build`), and Vercel serverless deployment. |
| **ChatGPT (OpenAI)** | PRD & TRD Document Authoring | Product Strategy & Architecture | Drafting Product Requirement Documents (PRD) and Technical Requirement Documents (TRD), defining user personas, functional specifications, database schema models, and system acceptance criteria. |
| **Claude (Anthropic)** | Prompt Enhancement & Logical Structuring | Requirement Engineering | Formulating high-clarity context prompts, refining architectural query specifications, and structuring clear instructions for complex feature implementations. |
| **Perplexity AI** | Technical Research & Prompt Optimization | Research & Troubleshooting | Researching Vercel serverless routing, Supabase PgBouncer pooler configurations, CORS policy baselines, and optimizing prompt context for bug diagnosis. |

---

## 🔍 Detailed Information on Tool Usage

### 1. 🤖 Google Antigravity (IDE & Autonomous Development Agent)
* **Role**: Primary Autonomous Coding Assistant & IDE Workspace Integration.
* **How It Was Used**:
  - **Full-Stack Implementation**: Wrote and modified frontend React components (TypeScript + Vite + Vanilla CSS) and backend Django services (`orders`, `accounts`, `products`, `operations`, `returns_exchange`, `audit`).
  - **Supabase Cloud Database Integration**: Built PostgreSQL database tables, implemented the global key-value cloud engine (`dmart_kv_store`), and configured SSL connection handling.
  - **Real-Time Cross-Browser Sync**: Engineered `cloudSync.ts` featuring `BroadcastChannel` and 3.5-second background polling to synchronize state live across Chrome, Firefox, Safari, Edge, Incognito, and Mobile devices.
  - **Core Engineering Solutions**: Implemented 6-digit sequential Order Numbering (`#ORD-2026-000101`...), user-specific order history privacy, dynamic pickup slot capacity reservations, and transparent inclusive tax pricing.
  - **Build & Verification**: Executed automated terminal builds (`npm run build`), managed Git commits/pushes, and resolved Vercel Serverless Function deployment routes.

---

### 2. 📝 ChatGPT (OpenAI)
* **Role**: Product & Technical Documentation Author.
* **How It Was Used**:
  - **Product Requirement Document (PRD)**: Outlined user stories, customer acceptance criteria, store staff workflows, and admin analytics metrics.
  - **Technical Requirement Document (TRD)**: Structured database schemas, REST API endpoints, HTTP request/response payloads, and state transition validation rules.

---

### 3. 🎨 Claude (Anthropic)
* **Role**: Prompt Enhancement & Architectural Reasoning.
* **How It Was Used**:
  - **Prompt Structuring**: Transformed initial user requirements into structured, unambiguous prompts for code generation.
  - **Edge Case Analysis**: Refined instruction clarity for edge cases such as slot capacity replenishment upon order cancellation and role-based data isolation.

---

### 4. 🔍 Perplexity AI
* **Role**: Real-Time Technical Research & Knowledge Synthesis.
* **How It Was Used**:
  - **Infrastructure Research**: Researched Vercel Serverless Function multi-builder routes (`@vercel/python` + `@vercel/static-build`) and Supabase transaction pooler settings (`:5432` vs `:6543`).
  - **Troubleshooting**: Synthesized solutions for cross-origin resource sharing (CORS) policies and Vercel routing behaviors.

---

## 📄 Compliance Statement

All AI-generated code and documentation were reviewed, compiled, and empirically verified for technical correctness, performance, and security compliance.
