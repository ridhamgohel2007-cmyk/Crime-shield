<div align="center">

<img src="https://img.shields.io/badge/CrimeShield-AI%20Command%20Center-0f172a?style=for-the-badge&logo=shield&logoColor=06b6d4" />

# 🛡️ CrimeShield — AI-Powered Crime Intelligence & Patrol Command Center

**A real-time, full-stack cybersecurity and law enforcement intelligence dashboard for predictive crime mapping, patrol optimization, and cyber-physical threat correlation.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Engine-FF6600?style=flat-square)](https://xgboost.readthedocs.io)
[![WebSocket](https://img.shields.io/badge/WebSocket-Live%20Feed-06b6d4?style=flat-square&logo=socket.io)](https://socket.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

**CrimeShield** is a next-generation, AI-driven command center built for law enforcement agencies to proactively predict, visualize, and respond to criminal threats in real time. It combines **machine learning-based crime prediction**, **interactive GIS mapping**, **cyber threat intelligence**, and **live patrol management** into a single, unified intelligence platform.

Built as a full-stack hackathon prototype, CrimeShield demonstrates how AI, geospatial data, and real-time WebSocket streaming can be fused together to give command officers an unprecedented situational awareness advantage.

---

## ✨ Key Features

### 🗺️ Live GIS Threat Map
- Interactive **Leaflet.js** map centered on Ahmedabad, India
- Real-time incident markers color-coded by crime type and severity
- **Risk Hotspot Circles** rendered from ML predictions (XGBoost risk scores)
- **Severity Filter** toggles (Critical / Moderate / Low) for focused analysis
- Highlighted zone overlays with cyan pulse rings when viewing patrol routes
- **Dark / Light mode** with theme-aware map tiles

### 🤖 AI Insights Panel
- **NLP-powered command bar** with intelligent query suggestions
- AI-generated actionable insights surfaced in a collapsible bottom panel
- Risk summaries cross-referenced with live event data

### 📊 Analytics Dashboard
- Donut charts, bar graphs, and trend sparklines for incident distribution
- Zone-by-zone risk ranking with direct "View on Map" drill-down
- Historical pattern analysis across time ranges (24h / Week / Month)

### 👮 Patrol Route Management
- Full patrol unit roster with status badges (Active / Standby / Rerouted)
- AI-optimized patrol route generation using Greedy TSP algorithm
- Real-time rerouting alerts via WebSocket live feed

### 🌐 Cyber Intelligence Module
- Correlated cyber–physical threat matrix
- Threat cards with severity classification, source attribution, and zone mapping
- One-click correlation from a cyber event to its physical map zone

### ⚙️ System Settings & Administration
- **Theme Configuration** — Dark / Light mode sync across the entire app
- **Risk Threshold Slider** — Configurable automated alert trigger level (0–100)
- **Notification Channels** — Toggles for SMS, Desktop Sound, and Email Reports
- **Role-Based Access Control** — Command Officer / Patrol Officer / Cyber Analyst
- **Export Audit Logs** — One-click CSV download of command center activity
- **Active System Status** — Live health badges for Database, GIS API, and NLP Engine

### 📡 Real-Time Live Intelligence Feed
- WebSocket-powered event stream (Flask-SocketIO ↔ React)
- Collapsible side panel with pulsing notification bell badge
- Live cards for critical alerts, patrol reroutes, and fraud detections

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CrimeShield Platform                  │
├──────────────────────┬──────────────────────────────────┤
│     Frontend (React) │        Backend (Flask)           │
│                      │                                  │
│  ┌────────────────┐  │  ┌──────────────────────────┐   │
│  │  GIS Map View  │  │  │  Flask REST API           │   │
│  │  (Leaflet.js)  │◄─┼─►│  /api/crimes              │   │
│  └────────────────┘  │  │  /api/predict/hotspots    │   │
│  ┌────────────────┐  │  │  /api/routes/optimize     │   │
│  │  Analytics     │  │  └──────────────────────────┘   │
│  │  (Charts)      │  │  ┌──────────────────────────┐   │
│  └────────────────┘  │  │  Flask-SocketIO            │   │
│  ┌────────────────┐  │  │  WebSocket Live Events    │   │
│  │  Patrol Mgmt   │◄─┼─►└──────────────────────────┘   │
│  └────────────────┘  │  ┌──────────────────────────┐   │
│  ┌────────────────┐  │  │  ML Engine                │   │
│  │  Cyber Intel   │  │  │  XGBoost Risk Prediction  │   │
│  └────────────────┘  │  │  DBSCAN Clustering        │   │
│  ┌────────────────┐  │  │  Isolation Forest         │   │
│  │  Settings      │  │  └──────────────────────────┘   │
│  └────────────────┘  │  ┌──────────────────────────┐   │
│                      │  │  Supabase (PostgreSQL)    │   │
│                      │  │  Realtime + Row Level Sec │   │
└──────────────────────┴──┴──────────────────────────────┘
```

---

## 🧠 ML Models

| Model | Purpose | Algorithm |
|---|---|---|
| **Risk Predictor** | Predict crime risk score per zone per hour | XGBoost Regressor |
| **Cluster Detector** | Identify geospatial crime clusters | DBSCAN |
| **Anomaly Detector** | Flag unusual incident patterns | Isolation Forest |

All models are trained on synthetic Ahmedabad crime data generated by `backend/scripts/generate_synthetic_data.py`. Run `backend/models/train_models.py` to retrain.

---

## 🗄️ Database Schema

```sql
-- crimes table (Supabase / PostgreSQL)
id           UUID PRIMARY KEY
lat, lng     FLOAT           -- Geospatial coordinates
crime_type   TEXT            -- Theft | Assault | Fraud | Cyber | Vandalism
severity     INT (1–5)       -- 1=Low, 5=Critical
timestamp    TIMESTAMPTZ
zone         TEXT            -- Navrangpura | Vastrapur | Maninagar ...
source       TEXT            -- Field Report | Sensor | Cyber Feed
status       TEXT            -- Active | Resolved | Under Investigation

-- patrol_routes table
route_geojson  JSONB         -- GeoJSON patrol path
zones_covered  TEXT[]        -- Array of covered zone names
risk_score_avg FLOAT         -- Average risk of covered zones
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/crimes` | Fetch latest 100 crime incidents |
| `GET` | `/api/predict/hotspots` | ML-predicted risk scores per zone |
| `GET` | `/api/routes/optimize` | AI-generated optimal patrol route |
| `WS` | `connect` | WebSocket — join live intelligence feed |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [Supabase](https://supabase.com) project

### 1. Clone the Repository
```bash
git clone https://github.com/ridhamgohel2007-cmyk/Crime-shield.git
cd Crime-shield
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your SUPABASE_URL and SUPABASE_KEY
```

### 3. Set Up the Database
```bash
# Run schema.sql in your Supabase SQL Editor
# Then populate with synthetic data:
python scripts/generate_synthetic_data.py
python scripts/upload_to_supabase.py
```

### 4. Train ML Models
```bash
python models/train_models.py
# This generates: xgboost_risk_model.pkl, dbscan_model.pkl,
#                 isolation_forest.pkl, label_encoder_zone.pkl
```

### 5. Start the Backend
```bash
python app.py
# Flask + SocketIO server running at http://localhost:5000
```

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Vite dev server running at http://localhost:5173
```

---

## 🔐 Security Architecture

| Layer | Implementation |
|---|---|
| **Database** | Supabase Row Level Security (RLS) policies on all tables |
| **API Keys** | All secrets loaded from `.env` via `python-dotenv` — never hardcoded |
| **CORS** | Flask-CORS configured to restrict cross-origin requests |
| **Data** | Fully synthetic dataset — no real PII or sensitive citizen data |
| **Auth** | Role-Based Access Control model defined (production-ready extension) |

> ⚠️ **Note:** RLS policies are set to public read/write for this hackathon prototype. In a production deployment, these should be restricted to authenticated service roles only.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Leaflet.js + React-Leaflet** | Interactive GIS mapping |
| **Recharts** | Analytics charts and graphs |
| **Socket.IO Client** | WebSocket live event feed |
| **Lucide React** | Icon system |
| **Outfit (Google Fonts)** | Typography |
| **Vanilla CSS** | Custom design system with CSS variables |

### Backend
| Technology | Role |
|---|---|
| **Flask** | REST API server |
| **Flask-SocketIO** | Real-time WebSocket events |
| **Flask-CORS** | Cross-origin request handling |
| **Supabase Python** | Database client |
| **XGBoost** | Crime risk prediction model |
| **scikit-learn** | DBSCAN clustering + Isolation Forest |
| **pandas** | Data processing |
| **python-dotenv** | Environment variable management |

### Infrastructure
| Service | Role |
|---|---|
| **Supabase** | PostgreSQL database + Realtime subscriptions |
| **CARTO** | Map tile provider |
| **OpenStreetMap** | Geospatial base data |

---

## 📁 Project Structure

```
Crime-shield/
├── backend/
│   ├── app.py                          # Flask API + WebSocket server
│   ├── requirements.txt                # Python dependencies
│   ├── schema.sql                      # Supabase database schema
│   ├── .env.example                    # Environment variable template
│   ├── data/
│   │   └── crimes_dataset.csv          # Synthetic crime data
│   ├── models/
│   │   └── train_models.py             # ML model training script
│   └── scripts/
│       ├── generate_synthetic_data.py  # Data generation
│       └── upload_to_supabase.py       # DB upload utility
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                    # App entry point
        ├── App.jsx                     # Root layout + state management
        ├── index.css                   # Global design system (CSS variables)
        └── components/
            ├── GISMap.jsx              # Leaflet map + incident overlays
            ├── Analytics.jsx           # Charts and zone analytics
            ├── Patrols.jsx             # Patrol management UI
            ├── CyberIntel.jsx          # Cyber threat intelligence feed
            └── Settings.jsx            # Admin settings panel
```

---

## 🌟 Hackathon Context

CrimeShield was built as a hackathon prototype to demonstrate the potential of fusing **AI/ML**, **real-time data streaming**, and **geospatial intelligence** for modern law enforcement operations. The system is designed to be:

- **Scalable** — Supabase's realtime infrastructure supports millions of events
- **Extensible** — ML models can be retrained on real crime datasets
- **Deployable** — Flask backend can be containerized with Docker; frontend deploys to Vercel/Netlify

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for a safer, smarter city.**

*CrimeShield — Predict. Prevent. Protect.*

</div>
