# 🚀 Setup & Execution Guide: Unified Civic Intelligence Platform

This document provides complete, step-by-step instructions to initialize, seed, and execute the **AI-Powered Civic Governance, Volunteer & Charity Ecosystem Platform**.

---

## 🏛 Platform Overview

The architecture consists of a highly responsive **React SPA** (Vite-powered) communicating with a robust **Flask API Server** backed by an interactive **SQLAlchemy DB** and a heuristic NLP brain.

```
                 +-----------------------------------------+
                 |              React SPA                  |
                 |      (Vite Dev Server on Port 5173)     |
                 +-------------------+---------------------+
                                     |
                         Vite Proxy  | /auth, /governance,
                                     | /tvk, /charity, /api
                                     v
                 +-------------------+---------------------+
                 |              Flask API                  |
                 |       (Threaded Core on Port 5000)      |
                 +-------------------+---------------------+
                                     |
                                     v
                         +-----------+-----------+
                         | SQLite Database File  |
                         +-----------------------+
```

---

## 🛠 Prerequisites

Ensure the following tools are globally installed:
1. **Node.js** (v18.0.0 or higher) — [Download](https://nodejs.org)
2. **Python** (v3.11.0 or higher) — [Download](https://python.org)

---

## 📥 Getting Started

### 1. Initialize Backend Environment (Python)

Activate the local virtual environment already pre-configured in the workspace:

#### **Windows PowerShell**
```powershell
# 1. Activate Virtual Environment
.\.venv\Scripts\Activate.ps1

# 2. Initialize database schemas & indices
flask --app run init-db

# 3. Seed demo accounts & sample activity datasets
flask --app run seed-demo
```

#### **macOS / Linux / Bash**
```bash
# 1. Activate Virtual Environment
source .venv/bin/activate

# 2. Initialize database schemas & indices
flask --app run init-db

# 3. Seed demo accounts & sample activity datasets
flask --app run seed-demo
```

---

### 2. Run Flask API Server
Once the virtual environment is active:
```powershell
# Start threaded backend core
python run.py


.\.venv\Scripts\python.exe run.py

```
*The backend API server launches at **`http://localhost:5000`**.*

---

### 3. Run React Frontend (Vite)
Open a **new, separate terminal window**, navigate to the `frontend/` subdirectory, and start the Vite compiler:
```powershell
cd frontend
node node_modules\vite\bin\vite.js
```
*The local development server compiles dependencies and serves the site at **`http://localhost:5173/`**.*

---

## 🔐 Interactive Role Credentials

The login screen features an **Instant Quick-Login Selector**. Simply click any role button to automatically fill credentials and log in:

| Role Badge | Email Address | Password | Intended Screen |
| :--- | :--- | :--- | :--- |
| **👑 Platform Administrator** | `admin@civic.local` | `Admin#12345` | Redirects to **Admin Operations Dashboard** |
| **👥 Demo Citizen** | `citizen@civic.local` | `Citizen#123` | Redirects to **Civic Home Dashboard** |
| **🙋 Active Volunteer** | `volunteer@civic.local` | `Volunteer#123` | Redirects to **TVK Singapadai System** |
| **🏛 Ward Councillor** | `councillor@civic.local` | `Councillor#123` | Redirects to **Local Constituency Hub** |

---

## 📊 Generating the PowerPoint Slide Deck
To dynamically rebuild or customize the widescreen corporate pitch deck:
```powershell
# In root directory (venv active)
python create_presentation.py
```
This builds **`Unified_Civic_Ecosystem_Platform.pptx`** containing slides outlining modules, NLP architectures, data trust ledgers, and roadmap scaling.

---

## ⚠️ Troubleshooting File Access Locks
If you encounter a Windows lock warning:
```
The process cannot access the file because it is being used by another process.
```
This means an active server is running in another terminal. Run this inside PowerShell to instantly kill and release all Python processes:
```powershell
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
```