# AI-Powered Civic Governance, Volunteer & Charity Ecosystem Platform

Welcome to **Unified Civic Intelligence (UCI)**, a next-generation web application designed to promote civic transparency, volunteer mobilization, and charitable trust. This platform integrates React, Flask, SQLAlchemy, and heuristic NLP engines to bridge the gap between citizens, volunteers, and public administrators.

---

## 🚀 Key Highlights & Accomplishments

- **100% React Migration**: Successfully migrated the entire frontend from old Jinja2 templates into a modern Single Page Application (SPA) utilizing Vite, React 18, and Tailwind CSS.
- **Multithreaded API Core**: Upgraded the Flask backend server from eventlet to robust native threading. Fully stabilized live development reloading and resolved CORS issues.
- **Immutable Trust Ledger**: Built a transparent public log tracking all donations, beneficiary welfare allocations, and volunteer service hours to assure zero-leakage trust.
- **Heuristic NLP Brain**: Enabled automatic complaint classification and sentiment analysis on citizen input narratives.

---

## 🏛 Platform Architecture

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
                 +----+-------------------------------+----+
                      |                               |
                      v                               v
           +----------+----------+         +----------+----------+
           |    Heuristic NLP    |         |   SQLAlchemy ORM    |
           |   & AI Suggestion   |         | (SQLite DB / SQLite) |
           +---------------------+         +---------------------+
```

---

## 📂 Project Structure

```
├── app/                        # Flask Backend Application Core
│   ├── blueprints/             # API Module Blueprints
│   │   ├── admin/              # Admin dashboard stats endpoints
│   │   ├── auth/               # User registration, login & JWT auth
│   │   ├── charity/            # Welfare request, transparency ledger & sponsors
│   │   ├── governance/         # Wards dashboards, project trackers & complaints
│   │   ├── tvk/                # Live party news, volunteer events & tasks
│   │   └── api/                # AI endpoints for automated text sentiment
│   ├── models/                 # SQLAlchemy schemas (Governance, Charity, TVK)
│   ├── services/               # AI NLP Engine (Sentiment analysis, Chatbot logic)
│   ├── extensions.py           # Database, Migrations, JWT and CORS initializers
│   └── __init__.py             # Flask Factory setup & Socket.IO rooms
├── frontend/                   # React Frontend Client (Vite App)
│   ├── src/
│   │   ├── components/         # Global layout, Sidebar, & Quick Chatbot widget
│   │   ├── context/            # AuthContext (Persisted state & API interceptors)
│   │   ├── pages/              # Hubs and forms for core services
│   │   │   ├── admin/          # Admin statistical analytics
│   │   │   ├── auth/           # Login & Registration views
│   │   │   ├── charity/        # Trust ledger, sponsors, transparency & volunteer logging
│   │   │   ├── governance/     # Ward metrics, complaints, land protection & emergencies
│   │   │   └── tvk/            # Singapadai leaderboard, tasks, & digital ID cards
│   │   ├── App.jsx             # React Router and page declarations
│   │   └── index.css           # Tailwind CSS directives
│   ├── vite.config.js          # Port 5173 config and reverse CORS proxy rules
│   └── package.json            # Node dev packages (Tailwind v3.4, React Router)
├── create_presentation.py       # PPTX automated slide generator script
├── run.py                      # Flask entry point script
└── Unified_Civic_Ecosystem_Platform.pptx  # Widescreen Project PPT deck
```

---

## 🛠 Setup & Running the Project

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **Python (v3.11+)** installed on your system.

### 2. Set Up Environment File
Create a `.env` file in the root directory (copied from `.env.example`):
```env
FLASK_CONFIG=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-key
DATABASE_URL=sqlite:///civic.db
```

### 3. Initialize & Seed Database
Open a **PowerShell** or **Command Prompt** window at the project root and activate the environment:
```powershell
# Activate Python Virtual Env
.\.venv\Scripts\activate.ps1

# Initialize Database and Tables
flask --app run init-db

# Seed Idempotent Demo Records
flask --app run seed-demo
```
*Successfully seeds the primary Administrator profile: `admin@civic.local` / `Admin#12345`.*

### 4. Run Flask Backend
In the active virtual environment shell:
```powershell
python run.py
```
*The API server will launch at `http://127.0.0.1:5000`.*

### 5. Run React Frontend
Open a **new** terminal window, navigate to the `frontend/` directory, and start Vite:
```powershell
cd frontend
node node_modules\vite\bin\vite.js
```
*The website will compile and launch at `http://localhost:5173/`.*

---

## 📈 Powerpoint Presentation
A professional widescreen presentation file has been generated for you:
👉 **`Unified_Civic_Ecosystem_Platform.pptx`**

To regenerate or modify this slide deck at any time, simply execute:
```powershell
python create_presentation.py
```
This will build an eight-slide structured corporate pitch detailing the platform's vision, system modules, NLP capabilities, and scaling prospects.

## 🔐 Demo Credentials

| Role | Email Address | Password |
|------|---------------|----------|
| **Platform Administrator** | `admin@civic.local` | `Admin#12345` |
| **Demo Citizen** | `citizen@civic.local` | `Citizen#123` |
| **Active Volunteer** | `volunteer@civic.local` | `Volunteer#123` |
| **Ward Councillor** | `councillor@civic.local` | `Councillor#123` |
