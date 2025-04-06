from flask import Flask, render_template, request, jsonify
import lzma, json, datetime, zlib, requests
import logging
import time
import os
import uuid

# Import our protocol functions
from disaster_protocol import create_emergency_packet, create_medical_packet, create_resource_packet, parse_packet

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API endpoints
API_ENDPOINTS = {
    "emergency": "http://192.168.137.1:8000/api/common/emergency",
    "medical": "http://192.168.137.1:8000/api/common/medical",
    "resource": "http://192.168.137.1:8000/api/common/resource"
}

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/emergencyMap')
def emergency_map():
    return render_template("emergencyMap.html")

@app.route('/emergency')
def emergency():
    return render_template("emergency.html")

@app.route('/medical')
def medical():
    return render_template("medical.html")

@app.route('/resource')
def resource():
    return render_template("resource.html")

@app.route('/submit', methods=["POST"])
def submit():
    try:
        # Get JSON data from the form
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "message": "No data received"}), 400
        
        # Extract common information
        form_type = data.get("alertType", "emergency")
        user_id = data.get("userId")
        new_user = 1 if not user_id or user_id == "null" else 0
        crisis_id = data.get("crisisId")
        lat = data.get("lat", 0)
        lng = data.get("lng", 0)
        
        # If no userId is provided, generate one
        if not user_id or user_id == "null":
            user_id = f"user_{uuid.uuid4().hex[:8]}"
        
        # Log the received data
        logger.info(f"Received {form_type} alert: {data}")
        
        # Create the binary packet based on form type
        if form_type == "emergency":
            binary_packet = create_emergency_packet(data)
        elif form_type == "medical":
            binary_packet = create_medical_packet(data)
        elif form_type == "resource":
            binary_packet = create_resource_packet(data)
        else:
            return jsonify({"status": "error", "message": "Unknown form type"}), 400
            
        packet_size = len(binary_packet)
        logger.info(f"Created binary packet: {packet_size} bytes")
        
        # Parse the packet to verify it worked
        try:
            parsed = parse_packet(binary_packet)
            logger.info(f"Packet validated successfully. Form type: {parsed['form_type']}")
        except Exception as e:
            logger.error(f"Packet validation failed: {str(e)}")
        
        # Create JSON for API – common fields for all form types
        json_data = {
            "userId": user_id,
            "location": {
                "lat": lat,
                "lng": lng
            },
            "crisisId": crisis_id or "",
            "dateTime": datetime.datetime.utcnow().isoformat(),
            "message": data.get("message", "")
        }
        
        # Add form-specific fields
        if form_type == "emergency":
            # Emergency fields (unchanged)
            severity = data.get("severity", 0)
            disaster_type = data.get("disasterType", 0)
            json_data.update({
                "severity": int(severity),
                "severityType": str(severity),
                "disasterType": int(disaster_type),
                "peopleAffected": data.get("peopleAffected", 0),
                "immediateResponse": 1 if data.get("immediateResponse", False) else 0
            })
        elif form_type == "medical":
            # Ensure numeric conversion for medical fields
            json_data.update({
                "patientCount": int(data.get("patientCount", 0)),
                "criticalCount": int(data.get("criticalCount", 0)),
                "disasterType": int(data.get("disasterType", 0)),
                "medicalResourceType": int(data.get("medicalResourceType", 0))
            })
        elif form_type == "resource":
            # For resource, use text priority (e.g., "High") as the API expects
            json_data.update({
                "resourceType": int(data.get("resourceType", 0)),
                "quantity": int(data.get("quantity", 0)),
                "priority": data.get("priorityText", "Low")
            })
        
        # Map the form type string to a 4-digit numeric code for the API:
        # 1000 for emergency, 2000 for medical, and 3000 for resource.
        # For resource requests, use the dropdown value (0–7) as the "type"
        if form_type == "resource":
            json_data["type"] = int(data.get("resourceType", 0))
        else:
            # For emergency and medical alerts, you can keep your mapping if needed
            type_mapping = {"emergency": 1000, "medical": 2000}
            json_data["type"] = type_mapping.get(form_type, 1000)

        # Add CRC for data integrity
        json_str = json.dumps(json_data)
        crc = format(zlib.crc32(json_str.encode("utf-8")) & 0xFFFFFFFF, '08X')
        json_data["crc"] = crc
        
        # Log sizes for comparison
        logger.info(f"JSON size: {len(json_str)} bytes")
        logger.info(f"Binary size: {packet_size} bytes")
        logger.info(f"Size reduction: {(1 - packet_size/len(json_str)) * 100:.1f}%")
        
        # For now, use JSON since the backend expects it (set use_binary = True when ready)
        use_binary = False
        
        headers = {
            "userId": user_id,
            "newuser": str(new_user),
            "crisisid": crisis_id or "",
            "longitude": str(lng),
            "latitude": str(lat),
            "Content-Type": "application/json"
        }
        
        api_endpoint = API_ENDPOINTS.get(form_type, API_ENDPOINTS["emergency"])
        
        # Send to the backend API
        try:
            if use_binary:
                compressed = lzma.compress(binary_packet)
                logger.info(f"Compressed binary size: {len(compressed)} bytes")
                headers["Content-Type"] = "application/octet-stream"
                headers["Content-Encoding"] = "lzma"
                response = requests.post(
                    api_endpoint,
                    headers=headers,
                    data=compressed,
                    timeout=5
                )
                transmitted_size = len(compressed)
            else:
                response = requests.post(
                    api_endpoint,
                    headers=headers,
                    json=json_data,
                    timeout=5
                )
                transmitted_size = len(json_str)
            
            status_code = response.status_code
            response_text = response.text
            logger.info(f"API response: {status_code} - {response_text}")
            
            try:
                response_json = response.json()
                if new_user == 1 and "userId" in response_json:
                    user_id = response_json.get("userId")
                if not crisis_id and "crisisid" in response_json:
                    crisis_id = response_json.get("crisisid")
            except Exception as e:
                logger.warning(f"Could not parse API response: {str(e)}")
            
            return jsonify({
                "status": "success",
                "original_size": len(json_str),
                "binary_size": packet_size,
                "transmitted_size": transmitted_size,
                "size_reduction": f"{(1 - packet_size/len(json_str)) * 100:.1f}%",
                "api_status": status_code,
                "api_response": response_text,
                "userId": user_id,
                "crisisId": crisis_id
            })
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return jsonify({
                "status": "partial_success",
                "message": "Alert processed locally but server unreachable",
                "binary_size": packet_size,
                "userId": user_id,
                "crisisId": crisis_id
            })
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error processing request: {str(e)}"
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)