# BranchChain MVP  
**Simple, Modular, and Auditable Banking Operations Dashboard**

---

## 🧭 What This Project Is

BranchChain MVP is a **staff dashboard for bank branches**.

It allows authorized branch staff to:

- Create accounts  
- Reset PINs  
- Replace cards  
- Update KYC  

Every action is:

- **Saved in a database** → current state  
- **Recorded in a ledger** → permanent history  

This is **not a monolithic system**.  
It is built as **small, clear modules** that are easy to understand, maintain, and scale in a team.

---

## 🎯 Core Philosophy

We follow three rules:

- **Simple over smart**  
- **Organized over complex**  
- **Readable over clever**

No huge files.  
No tightly coupled code.  
Each part does **one job only**.

---
## 📂 Project Structure

```text
branchchain-mvp/
│
├── frontend/                     # User interface (Dashboard)
│   ├── pages/                    # Each screen = one file
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── CreateAccount.js
│   │   ├── ResetPin.js
│   │   ├── ReplaceCard.js
│   │   ├── UpdateKYC.js
│   │   └── AuditLog.js
│   │
│   ├── services/                 # API calls only
│   │   └── api.js
│   │
│   └── App.js
│
├── backend/                      # API server
│   ├── routes/                   # One file per feature
│   │   ├── auth.routes.js
│   │   ├── accounts.routes.js
│   │   ├── cards.routes.js
│   │   ├── kyc.routes.js
│   │   └── audit.routes.js
│   │
│   ├── controllers/              # Business logic only
│   │   ├── accounts.controller.js
│   │   ├── cards.controller.js
│   │   ├── kyc.controller.js
│   │   └── audit.controller.js
│   │
│   ├── services/                 # External systems
│   │   ├── db.service.js         # Database logic
│   │   └── ledger.service.js     # Ledger (Fabric or simulated)
│   │
│   ├── models/                   # Data schemas
│   │   ├── Account.js
│   │   ├── Card.js
│   │   └── Customer.js
│   │
│   └── server.js
│
├── docs/                         # Diagrams, notes, meeting decisions
│
└── README.md



---

## 🧩 What Each Part Does

### 🎨 Frontend (Dashboard)

- Shows pages:  
  Login, Create Account, Reset PIN, Replace Card, Update KYC, Audit Log  
- Sends requests to the backend  
- Displays results  
- **No business logic here**

---

### 🧠 Backend (API)

- Receives requests from frontend  
- Decides what action is being performed  
- Sends:
  - **Current data → Database**
  - **Action record → Ledger**

---

### 🗄️ Database (Current State)

Stores:
- Accounts  
- Cards  
- Customer info  

Used for:
- Fast reads  
- Showing real-time status  

---

### 📒 Ledger (History)

Stores:
- Who did what  
- When it happened  
- From which branch  

Used for:
- Audit  
- Traceability  
- Accountability  

---

## 🔁 Simple Flow (No Complexity)

### Example: Replace Card

1. Staff logs in  
2. Clicks **Replace Card**  
3. Fills form → Submit  
4. Backend:
   - Updates **Database** (new card active)  
   - Writes to **Ledger** (record of the action)  
5. UI shows: `✅ Card replaced`  
6. Audit Log can show the action later  

---

## 🧠 Why We Separate DB and Ledger

| Part      | Purpose                  |
|-----------|--------------------------|
| Database  | What is true **now**     |
| Ledger    | What happened **over time** |

We **do not mix them**.  
This keeps the system:

✔ Clean  
✔ Understandable  
✔ Easy to debug  

---

## 🔌 API Endpoints (Simple & Clear)

POST /auth/login
POST /accounts/create
POST /accounts/reset-pin
POST /cards/replace
PUT /kyc/update
GET /audit/:accountId


Each endpoint:

- Updates **Database**
- Records action in **Ledger**

---

## 🧪 Testing Approach

- **Frontend:** Browser dev tools  
- **Backend:** Postman  
- **Ledger:** Audit endpoint  

No complex frameworks unless needed.

---

## 🛠️ Team Workflow

Each developer owns a clear area:

| Role          | Focus                  |
|---------------|------------------------|
| Frontend Dev  | Pages, UI, forms       |
| Backend Dev   | API, controllers       |
| Data Dev      | Database models        |
| Ledger Dev    | `ledger.service.js`    |
| Lead Engineer | Structure & integration|

No one touches everything.  
No giant files.

---

## 🚀 Scaling This Later

We can add:

- More branches  
- More actions  
- More audit features  

Without changing the structure.

Just:

- Add a new route  
- Add a controller  
- Log the action  
