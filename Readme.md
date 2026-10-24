# HCM Lite — AI-Assisted Human Capital Management (Backend)

Backend API for **HCM Lite**, built for the Saylani Hackathon. A complete web-based Human Capital Management system designed for Admin, HR, and Employees with an integrated AI assistant.

---

## 🚀 Tech Stack
* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** MongoDB Atlas / Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## 📂 Project Architecture (9 Modules)
1. **M1: Auth & Access** — JWT authentication, role-based access control (`admin`, `hr`, `employee`), and data-scope guards.
2. **M2: Organization Setup** — Company settings, office hours, grace time, location radius, departments, and leave quotas.
3. **M3: Employee Management** — Employee directory, search, filters, and HR registration (auto-creates logins).
4. **M4: Attendance** — Server-stamped web check-in/out, status rules (late, half-day, absent).
5. **M5: Leave Management** — Leave applications, balance tracking, date overlap checks, and approval inbox.
6. **M6: Payroll Lite** — Salary structures, gross calculation (1.5x basic), tax slabs, and monthly locking by Admin.
7. **M7: Dashboards & Analytics** — Server-side database aggregations for real-time KPIs and trends.
8. **M8: AI Assistant** — Tool-calling enabled chat assistant operating strictly on real database records.
9. **M9: Comms & Audit Log** — In-app notifications, announcements, and comprehensive audit trails[cite: 3, 4, 7].

---
 
## ⚙️ Getting Started & Local Installation

### 1. Clone the repository & install dependencies
```bash
git clone <your-repository-url>
cd backend
npm install