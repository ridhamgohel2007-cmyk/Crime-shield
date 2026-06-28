import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
from supabase import create_client, Client
import joblib
import pandas as pd
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Supabase connection
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None

# Load ML Models safely
models_dir = os.path.join(os.path.dirname(__file__), 'models')
try:
    xgb_model = joblib.load(os.path.join(models_dir, 'xgboost_risk_model.pkl'))
    dbscan_model = joblib.load(os.path.join(models_dir, 'dbscan_model.pkl'))
    iso_forest = joblib.load(os.path.join(models_dir, 'isolation_forest.pkl'))
    le_zone = joblib.load(os.path.join(models_dir, 'label_encoder_zone.pkl'))
    print("ML Models loaded successfully.")
except Exception as e:
    print(f"Warning: ML models not found or failed to load. Please run train_models.py first. ({e})")
    xgb_model = None
    le_zone = None

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "CrimeShield API"})

@app.route("/api/crimes", methods=["GET"])
def get_crimes():
    # Simple fetch of recent 100 crimes from Supabase
    if not supabase:
        return jsonify({"error": "Supabase not configured"}), 500
    
    response = supabase.table("crimes").select("*").order("timestamp", desc=True).limit(100).execute()
    return jsonify(response.data)

@app.route("/api/predict/hotspots", methods=["GET"])
def predict_hotspots():
    if not xgb_model or not le_zone:
        return jsonify({"error": "ML Models not loaded"}), 500
        
    # Predict risk for all known zones for the *current hour*
    now = datetime.now()
    hour_of_day = now.hour
    day_of_week = now.weekday()
    
    predictions = []
    zones = le_zone.classes_
    
    for zone in zones:
        zone_encoded = le_zone.transform([zone])[0]
        # Create input df
        X_pred = pd.DataFrame({
            'zone_encoded': [zone_encoded],
            'hour_of_day': [hour_of_day],
            'day_of_week': [day_of_week]
        })
        
        score = xgb_model.predict(X_pred)[0]
        predictions.append({
            "zone": zone,
            "risk_score": round(float(score), 2),
            "hour": hour_of_day
        })
        
    # Sort descending by risk score
    predictions = sorted(predictions, key=lambda x: x["risk_score"], reverse=True)
    return jsonify({"predictions": predictions})

@app.route("/api/routes/optimize", methods=["GET"])
def optimize_route():
    # Greedy TSP-based mock logic targeting top risk zones
    if not xgb_model or not le_zone:
        return jsonify({"error": "ML Models not loaded"}), 500
        
    # Get top 3 risky zones
    hotspots_response = predict_hotspots().json
    top_zones = hotspots_response["predictions"][:3]
    
    route_plan = {
        "unit_id": "P-AI-01",
        "status": "Generated",
        "waypoints": [
            {"step": 1, "zone": top_zones[0]["zone"], "action": "Patrol High Risk Hotspot", "risk": top_zones[0]["risk_score"]},
            {"step": 2, "zone": top_zones[1]["zone"], "action": "Secondary Sweep", "risk": top_zones[1]["risk_score"]},
            {"step": 3, "zone": top_zones[2]["zone"], "action": "Perimeter Check", "risk": top_zones[2]["risk_score"]}
        ]
    }
    
    return jsonify(route_plan)

@socketio.on('connect')
def handle_connect():
    print("Client connected to WebSocket")
    socketio.emit('live_event', {"title": "System Online", "type": "info"})

if __name__ == '__main__':
    # Run the server
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
