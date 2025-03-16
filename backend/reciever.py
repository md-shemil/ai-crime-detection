from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow CORS for API routes

DB_PATH = "cameras.db"

# Initialize the database
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        
        # Create cameras table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cameras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                stream_url TEXT NOT NULL,
                location TEXT NOT NULL
            )
        """)

        # Create alerts table with alert_type
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                severity TEXT NOT NULL,
                alert_type TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        """)
        
        conn.commit()

init_db()  # Ensure DB exists on startup

# Function to check camera health status
def check_camera_health(camera_url):
    try:
        response = requests.get(f"{camera_url}/api/health", timeout=3)
        if response.status_code == 200:
            return "online"
        return "unreachable"
    except requests.RequestException:
        return "offline"

# Route to add a new camera
@app.route("/api/cameras", methods=["POST"])
def add_camera():
    data = request.json
    if not all(key in data for key in ["name", "streamUrl", "location"]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO cameras (name, stream_url, location) VALUES (?, ?, ?)",
                (data["name"], data["streamUrl"], data["location"]),
            )
            conn.commit()
        return jsonify({"message": "Camera added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to get all cameras with optional pagination
@app.route("/api/cameras", methods=["GET"])
def get_cameras():
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    offset = (page - 1) * per_page

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cameras LIMIT ? OFFSET ?", (per_page, offset))
            cameras = [
                {
                    "id": row[0],
                    "name": row[1],
                    "streamUrl": row[2],
                    "location": row[3],
                    "health_status": check_camera_health(row[2]),
                }
                for row in cursor.fetchall()
            ]
        return jsonify(cameras), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to update a camera (allows partial updates)
@app.route("/api/cameras/<int:camera_id>", methods=["PUT"])
def update_camera(camera_id):
    data = request.json
    updates = {key: data[key] for key in ["name", "streamUrl", "location"] if key in data}

    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            for key, value in updates.items():
                cursor.execute(f"UPDATE cameras SET {key} = ? WHERE id = ?", (value, camera_id))
            conn.commit()
        return jsonify({"message": "Camera updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to delete a camera
@app.route("/api/cameras/<int:camera_id>", methods=["DELETE"])
def delete_camera(camera_id):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
            conn.commit()
        return jsonify({"message": "Camera deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to add an alert when threats are detected
@app.route("/api/alert", methods=["POST"])
def add_alert():
    data = request.json
    if "detections" not in data:
        return jsonify({"error": "Detections are required"}), 400

    detections = data["detections"]  # Expected: List of detected objects
    if not isinstance(detections, list):
        return jsonify({"error": "Detections should be a list"}), 400

    # List of threats to detect (converted to lowercase for case-insensitive comparison)
    relevant_objects = [
        "aggressor", "blood", "hand", "knife_deploy", "knife_weapon", "person",
        "stabbing", "victim", "handgun", "pistol", "rifle", "shotgun", "violence"
    ]
    
    detected_threats = [obj.lower() for obj in detections if obj.lower() in relevant_objects]
    if not detected_threats:
        return jsonify({"message": "No threats detected"}), 200

    # Determine severity
    severity = "high" if any(obj in detected_threats for obj in ["handgun", "pistol", "rifle", "shotgun", "violence"]) else "medium"

    # Determine alert type (weapon vs threat)
    if any(obj in detected_threats for obj in ["handgun", "pistol", "rifle", "shotgun", "knife_weapon", "knife_deploy"]):
        alert_type = "weapon"
    else:
        alert_type = "threat"

    timestamp = datetime.now().isoformat()

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO alerts (message, severity, alert_type, timestamp) VALUES (?, ?, ?, ?)",
                (f"Detected: {', '.join(detected_threats)}", severity, alert_type, timestamp),
            )
            conn.commit()
        return jsonify({
            "message": "Alert added successfully",
            "detections": detected_threats,
            "severity": severity,
            "type": alert_type
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to fetch all alerts
@app.route("/api/alert", methods=["GET"])
def get_alerts():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM alerts ORDER BY timestamp DESC")
            alerts = [
                {
                    "id": row[0],
                    "message": row[1],
                    "severity": row[2],
                    "type": row[3],
                    "timestamp": row[4]
                }
                for row in cursor.fetchall()
            ]
        return jsonify(alerts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=False)
