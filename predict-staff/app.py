import os
import random
import requests
from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Replace with your actual Google API key
GOOGLE_API_KEY = "AIzaSyBiq620-FjtVuJZaZ8emjsPbTNyMCS2-no"

# Define a list of random error messages.
ERROR_MESSAGES = [
    "Oops! Something went wrong.",
    "Unexpected error occurred. Please try again.",
    "Error encountered. Please retry.",
    "Something went wrong. We apologize for the inconvenience.",
    "Our apologies, an error occurred.",
    "Unexpected hiccup encountered. Try again later.",
    "Error detected. Please check your input.",
    "We encountered an error. Please try once more.",
    "Oops, something didn't work as expected.",
    "A problem occurred. Please try again soon."
]

def random_error_response(status_code=500):
    return jsonify({'error': random.choice(ERROR_MESSAGES)}), status_code

def get_county_from_coordinates_google(lat, lon, api_key):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lon}&key={api_key}"
    
    response = requests.get(url)
    if response.status_code != 200:
        return random_error_response(500)
    
    data = response.json()
    if data['status'] != 'OK':
        return random_error_response(500)
    
    results = data.get('results', [])
    county = None
    state = None
    country = None
    
    for result in results:
        for component in result['address_components']:
            if 'administrative_area_level_2' in component['types']:
                county = component['long_name']
            elif 'administrative_area_level_1' in component['types']:
                state = component['long_name']
            elif 'country' in component['types']:
                country = component['long_name']
    
    if county and county.endswith(" County"):
        county = county.replace(" County", "").strip()
    
    return {
        'county': county,  # Will be None if not found.
        'state': state or 'State not found',
        'country': country or 'Country not found',
        'full_address': results[0]['formatted_address'] if results else 'N/A'
    }

# Load population data once at startup.
population_file_path = os.path.join(os.getcwd(), 'population.csv')
try:
    population_data = pd.read_csv(population_file_path)
except Exception:
    # If population file cannot be read, return a random error.
    raise Exception(random.choice(ERROR_MESSAGES))

# Determine the correct population column name.
pop_col = None
for col in population_data.columns:
    if col.lower() in ['population', 'total population']:
        pop_col = col
        break
if pop_col is None:
    raise KeyError("Population column not found in population.csv. Please ensure it has a 'Population' or 'Total Population' column.")

# Load the saved staff prediction model.
model_file_path = os.path.join(os.getcwd(), 'staff_prediction_model.pkl')
with open(model_file_path, 'rb') as f:
    model_data = pickle.load(f)

model = model_data['model']
label_encoders = model_data['label_encoders']
scaler = model_data['scaler']
expected_columns = ['DisasterTypeID', 'SeverityTypeID', 'Population', 'County']

def predict_staff_required(county, disaster_type_id, severity_type_id, population):
    """
    Preprocess the input and predict the staff required.
    """
    input_data = pd.DataFrame([[disaster_type_id, severity_type_id, population, county]], 
                              columns=expected_columns)
    
    for col in ['DisasterTypeID', 'SeverityTypeID', 'County']:
        if col in label_encoders:
            try:
                input_data[col] = label_encoders[col].transform(input_data[col])
            except ValueError:
                input_data[col] = 0  
    input_data['Population'] = scaler.transform(input_data[['Population']])
    prediction = model.predict(input_data)
    return int(prediction[0])

@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint to predict the number of staff required.
    Input can be provided either as:
      Option A:
      {
          "county": "Name of the county",
          "disaster_type_id": <integer>,
          "severity_type_id": <integer>
      }
      Option B (using coordinates):
      {
          "location": {"lat": <latitude>, "lng": <longitude>},
          "disaster_type_id": <integer>,
          "severity_type_id": <integer>
      }
    If the location is provided, the Google Geocoding API is used to determine the county.
    """
    data = request.get_json(force=True)
    print(data)
    county = data.get('county')
    disaster_type_id = data.get('disaster_type_id')
    severity_type_id = data.get('severity_type_id')
    
    # If county is not provided, check for a "location" object.
    if not county:
        location = data.get('location')
        if location:
            lat = location.get('lat')
            lon = location.get('lng')
        else:
            lat = data.get('lat')
            lon = data.get('lon')
        
        if lat is None or lon is None:
            return random_error_response(400)
        try:
            lat = float(lat)
            lon = float(lon)
        except ValueError:
            return random_error_response(400)
        if lon > 0:
            lon = lon * -1
        county_data = get_county_from_coordinates_google(lat, lon, GOOGLE_API_KEY)
        # Check if get_county_from_coordinates_google returned an error response.
        if isinstance(county_data, tuple):
            # county_data is a tuple if error was returned by random_error_response
            return county_data
        county = county_data['county']
        if not county:
            return random_error_response(404)
    
    if disaster_type_id is None or severity_type_id is None:
        return random_error_response(400)
    
    # Lookup population by county (case insensitive).
    population_row = population_data[population_data['county'].str.lower() == county.lower()]
    if population_row.empty:
        return random_error_response(404)
    
    try:
        population = float(population_row.iloc[0][pop_col])
    except Exception:
        return random_error_response(500)
    
    try:
        disaster_type_id = int(disaster_type_id)
        severity_type_id = int(severity_type_id)
    except ValueError:
        return random_error_response(400)
    
    try:
        predicted_staff = predict_staff_required(county, disaster_type_id, severity_type_id, population)
    except Exception:
        return random_error_response(500)
    
    return jsonify({'predicted_staff_required': predicted_staff})

@app.route('/')
def index():
    html = '''
    <!doctype html>
    <html>
    <head>
      <title>Staff Prediction App</title>
    </head>
    <body>
      <h1>Staff Prediction</h1>
      <form id="predictForm">
        <p>Either enter the county or latitude/longitude (or a location object):</p>
        <label for="county">County:</label>
        <input type="text" id="county" name="county"><br><br>
        <label for="lat">Latitude:</label>
        <input type="text" id="lat" name="lat"><br><br>
        <label for="lon">Longitude:</label>
        <input type="text" id="lon" name="lon"><br><br>
        <p>Or use a location object (JSON format):</p>
        <textarea id="location" name="location" rows="3" cols="30" placeholder='{"lat":33.1795, "lng":-96.4930}'></textarea><br><br>
        <label for="disaster_type_id">Disaster Type ID:</label>
        <input type="number" id="disaster_type_id" name="disaster_type_id" required><br><br>
        <label for="severity_type_id">Severity Type ID:</label>
        <input type="number" id="severity_type_id" name="severity_type_id" required><br><br>
        <button type="submit">Predict</button>
      </form>
      <h2>Prediction Result:</h2>
      <div id="result"></div>
      <script>
      document.getElementById('predictForm').addEventListener('submit', function(e){
          e.preventDefault();
          var county = document.getElementById('county').value;
          var lat = document.getElementById('lat').value;
          var lon = document.getElementById('lon').value;
          var locationText = document.getElementById('location').value;
          var disaster_type_id = document.getElementById('disaster_type_id').value;
          var severity_type_id = document.getElementById('severity_type_id').value;
          var payload = {
              disaster_type_id: disaster_type_id,
              severity_type_id: severity_type_id
          };
          if(county) {
              payload.county = county;
          } else if(locationText) {
              try {
                  payload.location = JSON.parse(locationText);
              } catch(e) {
                  document.getElementById('result').innerHTML = 'Error: Invalid JSON for location. Please use double quotes for keys and string values.';
                  return;
              }
          } else {
              payload.lat = lat;
              payload.lon = lon;
          }
          fetch('/predict', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(payload)
          })
          .then(response => {
              if (!response.ok) {
                  return response.text().then(text => { throw new Error(text) });
              }
              return response.json();
          })
          .then(data => {
              document.getElementById('result').innerHTML = JSON.stringify(data);
          })
          .catch(error => {
              document.getElementById('result').innerHTML = 'Error: ' + error.message;
          });
      });
      </script>
    </body>
    </html>
    '''
    return html

if __name__ == '__main__':
    app.run(debug=True)
