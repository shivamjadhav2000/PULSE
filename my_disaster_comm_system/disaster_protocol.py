import struct
import time
import zlib
import uuid

def create_emergency_packet(data):
    """
    Create an efficient binary packet for emergency alerts with minimal size.
    
    Format:
    - 1 byte: Protocol version (1)
    - 1 byte: Form type (1 = emergency)
    - 4 bytes: User ID hash (0 if new user)
    - 1 byte: New user flag (1 or 0)
    - 4 bytes: Latitude (float)
    - 4 bytes: Longitude (float)
    - 4 bytes: Crisis ID hash (0 if new)
    - 4 bytes: Timestamp (Unix time)
    - 1 byte: Severity (0-3)
    - 1 byte: Disaster type (0-6)
    - 2 bytes: People affected (0-65535)
    - 1 byte: Immediate response (0 or 1)
    - 1 byte: Message length (0-255)
    - 0-255 bytes: Message content
    - 4 bytes: CRC32 checksum
    
    Total fixed size: 28 bytes + message length
    """
    packet = bytearray()
    
    # Extract data
    user_id = data.get("userId")
    new_user = 1 if not user_id or user_id == "null" else 0
    crisis_id = data.get("crisisId")
    lat = data.get("lat", 0)
    lng = data.get("lng", 0)
    severity = data.get("severity", 0)
    disaster_type = data.get("disasterType", 0)
    people_affected = data.get("peopleAffected", 0)
    immediate_response = 1 if data.get("immediateResponse", False) else 0
    message = data.get("message", "")
    
    # Protocol version
    packet.append(1)
    
    # Form type (1 = emergency)
    packet.append(1)
    
    # User ID (hash to 4 bytes)
    if user_id and user_id != "null":
        user_id_hash = zlib.crc32(str(user_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        user_id_hash = 0
    packet.extend(user_id_hash.to_bytes(4, byteorder='big'))
    
    # New user flag
    packet.append(new_user)
    
    # Coordinates
    packet.extend(struct.pack('>f', float(lat)))
    packet.extend(struct.pack('>f', float(lng)))
    
    # Crisis ID (hash to 4 bytes)
    if crisis_id and crisis_id != "null":
        crisis_id_hash = zlib.crc32(str(crisis_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        crisis_id_hash = 0
    packet.extend(crisis_id_hash.to_bytes(4, byteorder='big'))
    
    # Timestamp
    timestamp = int(time.time())
    packet.extend(timestamp.to_bytes(4, byteorder='big'))
    
    # Emergency data
    packet.append(min(3, int(severity)))  # Severity (0-3)
    packet.append(min(6, int(disaster_type)))  # Disaster type (0-6)
    packet.extend(min(65535, int(people_affected)).to_bytes(2, byteorder='big'))  # People affected
    packet.append(immediate_response)  # Immediate response flag
    
    # Message
    if message:
        message_bytes = str(message).encode('utf-8')[:255]  # Limit to 255 bytes
        packet.append(len(message_bytes))  # Message length
        packet.extend(message_bytes)  # Message content
    else:
        packet.append(0)  # Zero-length message
    
    # Generate CRC32 checksum of all data
    crc = zlib.crc32(packet) & 0xFFFFFFFF
    packet.extend(crc.to_bytes(4, byteorder='big'))
    
    return bytes(packet)

def create_medical_packet(data):
    """
    Create an efficient binary packet for medical alerts.
    
    Format:
    - 1 byte: Protocol version (1)
    - 1 byte: Form type (2 = medical)
    - 4 bytes: User ID hash (0 if new user)
    - 1 byte: New user flag (1 or 0)
    - 4 bytes: Latitude (float)
    - 4 bytes: Longitude (float)
    - 4 bytes: Crisis ID hash (0 if new)
    - 4 bytes: Timestamp (Unix time)
    - 2 bytes: Patient count (0-65535)
    - 2 bytes: Critical count (0-65535)
    - 1 byte: Disaster type (0-6)
    - 1 byte: Medical resource type (0-6)
    - 1 byte: Message length (0-255)
    - 0-255 bytes: Message content
    - 4 bytes: CRC32 checksum
    """
    packet = bytearray()
    
    user_id = data.get("userId")
    new_user = 1 if not user_id or user_id == "null" else 0
    crisis_id = data.get("crisisId")
    lat = float(data.get("lat", 0))
    lng = float(data.get("lng", 0))
    patient_count = int(data.get("patientCount", 0))
    critical_count = int(data.get("criticalCount", 0))
    disaster_type = int(data.get("disasterType", 0))
    medical_resource_type = int(data.get("medicalResourceType", 0))
    message = data.get("message", "")
    
    packet.append(1)  # Protocol version
    packet.append(2)  # Form type (medical)
    
    if user_id and user_id != "null":
        user_id_hash = zlib.crc32(str(user_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        user_id_hash = 0
    packet.extend(user_id_hash.to_bytes(4, byteorder='big'))
    
    packet.append(new_user)
    packet.extend(struct.pack('>f', lat))
    packet.extend(struct.pack('>f', lng))
    
    if crisis_id and crisis_id != "null":
        crisis_id_hash = zlib.crc32(str(crisis_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        crisis_id_hash = 0
    packet.extend(crisis_id_hash.to_bytes(4, byteorder='big'))
    
    timestamp = int(time.time())
    packet.extend(timestamp.to_bytes(4, byteorder='big'))
    
    packet.extend(min(65535, patient_count).to_bytes(2, byteorder='big'))
    packet.extend(min(65535, critical_count).to_bytes(2, byteorder='big'))
    packet.append(min(6, disaster_type))
    packet.append(min(6, medical_resource_type))
    
    if message:
        message_bytes = str(message).encode('utf-8')[:255]
        packet.append(len(message_bytes))
        packet.extend(message_bytes)
    else:
        packet.append(0)
    
    crc = zlib.crc32(packet) & 0xFFFFFFFF
    packet.extend(crc.to_bytes(4, byteorder='big'))
    
    return bytes(packet)


def create_resource_packet(data):
    """
    Create an efficient binary packet for resource requests.
    
    Format:
    - 1 byte: Protocol version (1)
    - 1 byte: Form type (3 = resource)
    - 4 bytes: User ID hash (0 if new user)
    - 1 byte: New user flag (1 or 0)
    - 4 bytes: Latitude (float)
    - 4 bytes: Longitude (float)
    - 4 bytes: Crisis ID hash (0 if new)
    - 4 bytes: Timestamp (Unix time)
    - 1 byte: Resource type (0-7)
    - 2 bytes: Quantity (0-65535)
    - 1 byte: Priority (0=Low, 1=Medium, 2=High)
    - 1 byte: Message length (0-255)
    - 0-255 bytes: Message content
    - 4 bytes: CRC32 checksum
    """
    packet = bytearray()
    
    user_id = data.get("userId")
    new_user = 1 if not user_id or user_id == "null" else 0
    crisis_id = data.get("crisisId")
    lat = float(data.get("lat", 0))
    lng = float(data.get("lng", 0))
    resource_type = int(data.get("resourceType", 0))
    quantity = int(data.get("quantity", 0))
    message = data.get("message", "")
    
    priority_val = data.get("priorityText", data.get("priority", 0))
    if isinstance(priority_val, str):
        priority_map = {'Low': 0, 'Medium': 1, 'High': 2}
        priority = priority_map.get(priority_val, 0)
    else:
        priority = int(priority_val)
    
    packet.append(1)  # Protocol version
    packet.append(3)  # Form type (resource)
    
    if user_id and user_id != "null":
        user_id_hash = zlib.crc32(str(user_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        user_id_hash = 0
    packet.extend(user_id_hash.to_bytes(4, byteorder='big'))
    
    packet.append(new_user)
    packet.extend(struct.pack('>f', lat))
    packet.extend(struct.pack('>f', lng))
    
    if crisis_id and crisis_id != "null":
        crisis_id_hash = zlib.crc32(str(crisis_id).encode('utf-8')) & 0xFFFFFFFF
    else:
        crisis_id_hash = 0
    packet.extend(crisis_id_hash.to_bytes(4, byteorder='big'))
    
    timestamp = int(time.time())
    packet.extend(timestamp.to_bytes(4, byteorder='big'))
    
    packet.append(min(7, resource_type))
    packet.extend(min(65535, quantity).to_bytes(2, byteorder='big'))
    packet.append(min(2, priority))
    
    if message:
        message_bytes = str(message).encode('utf-8')[:255]
        packet.append(len(message_bytes))
        packet.extend(message_bytes)
    else:
        packet.append(0)
    
    crc = zlib.crc32(packet) & 0xFFFFFFFF
    packet.extend(crc.to_bytes(4, byteorder='big'))
    
    return bytes(packet)


def parse_packet(packet_data):
    """
    Parse a binary packet and return its components based on form type.
    
    Returns a dictionary with the parsed data.
    """
    # Ensure minimum packet length
    if len(packet_data) < 20:  # Absolute minimum size
        raise ValueError("Packet too small")
    
    # Extract CRC
    received_crc = int.from_bytes(packet_data[-4:], byteorder='big')
    packet_data_without_crc = packet_data[:-4]
    
    # Verify CRC
    calculated_crc = zlib.crc32(packet_data_without_crc) & 0xFFFFFFFF
    if calculated_crc != received_crc:
        raise ValueError(f"CRC mismatch: calculated {calculated_crc}, received {received_crc}")
    
    # Parse common header
    offset = 0
    
    # Protocol version
    version = packet_data[offset]
    offset += 1
    
    # Form type
    form_type = packet_data[offset]
    offset += 1
    
    # User ID hash
    user_id_hash = int.from_bytes(packet_data[offset:offset+4], byteorder='big')
    offset += 4
    
    # New user flag
    new_user = packet_data[offset]
    offset += 1
    
    # Coordinates
    lat = struct.unpack('>f', packet_data[offset:offset+4])[0]
    offset += 4
    lng = struct.unpack('>f', packet_data[offset:offset+4])[0]
    offset += 4
    
    # Crisis ID hash
    crisis_id_hash = int.from_bytes(packet_data[offset:offset+4], byteorder='big')
    offset += 4
    
    # Timestamp
    timestamp = int.from_bytes(packet_data[offset:offset+4], byteorder='big')
    offset += 4
    
    # Create base result
    result = {
        "version": version,
        "form_type": form_type,
        "user_id_hash": user_id_hash,
        "new_user": new_user,
        "lat": lat,
        "lng": lng,
        "crisis_id_hash": crisis_id_hash,
        "timestamp": timestamp
    }
    
    # Parse form-specific data
    if form_type == 1:  # Emergency
        # Parse emergency data
        severity = packet_data[offset]
        offset += 1
        disaster_type = packet_data[offset]
        offset += 1
        people_affected = int.from_bytes(packet_data[offset:offset+2], byteorder='big')
        offset += 2
        immediate_response = packet_data[offset]
        offset += 1
        
        result["severity"] = severity
        result["disaster_type"] = disaster_type
        result["people_affected"] = people_affected
        result["immediate_response"] = immediate_response
        
    elif form_type == 2:  # Medical
        # Parse medical data
        patient_count = int.from_bytes(packet_data[offset:offset+2], byteorder='big')
        offset += 2
        critical_count = int.from_bytes(packet_data[offset:offset+2], byteorder='big')
        offset += 2
        disaster_type = packet_data[offset]
        offset += 1
        medical_resource_type = packet_data[offset]
        offset += 1
        
        result["patient_count"] = patient_count
        result["critical_count"] = critical_count
        result["disaster_type"] = disaster_type
        result["medical_resource_type"] = medical_resource_type
        
    elif form_type == 3:  # Resource
        # Parse resource data
        resource_type = packet_data[offset]
        offset += 1
        quantity = int.from_bytes(packet_data[offset:offset+2], byteorder='big')
        offset += 2
        priority = packet_data[offset]
        offset += 1
        
        result["resource_type"] = resource_type
        result["quantity"] = quantity
        result["priority"] = priority
        
        # Convert priority number back to string
        priority_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        result["priority_text"] = priority_map.get(priority, 'Low')
        
    # Parse message if present
    if offset < len(packet_data_without_crc):
        message_length = packet_data[offset]
        offset += 1
        
        if message_length > 0 and offset + message_length <= len(packet_data_without_crc):
            message = packet_data[offset:offset+message_length].decode('utf-8', errors='ignore')
            result["message"] = message
    
    return result