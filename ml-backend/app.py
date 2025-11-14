from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random
from datetime import datetime, timedelta
import io
from PIL import Image
import base64
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input

app = Flask(__name__)
CORS(app)

# Load the trained model at startup
MODEL_PATH = 'plant_disease_model_best.keras'
model = None
CLASS_NAMES = ['Anthracnose', 'Healthy', 'Leaf_Crinckle', 'Powdery_Mildew', 'Yellow_Mosaic']

# Disease information and recommendations based on agricultural research
DISEASE_INFO = {
    'Anthracnose': {
        'scientific_name': 'Colletotrichum spp.',
        'severity': 'Moderate to Severe',
        'description': 'A fungal disease causing dark, sunken lesions on leaves, stems, and fruits. Common in warm, humid conditions.',
        'symptoms': [
            'Dark brown to black spots with yellow halos on leaves',
            'Sunken lesions on fruits and stems',
            'Premature leaf drop and fruit rot',
            'Circular or irregular lesions that may have pink spore masses in humid conditions'
        ],
        'recommendations': [
            'Remove and destroy infected plant parts immediately to prevent spread',
            'Apply copper-based fungicides (Copper oxychloride 50% WP at 3g/L) every 10-14 days',
            'Use systemic fungicides like Carbendazim (1g/L) or Mancozeb (2.5g/L)',
            'Improve air circulation by proper spacing between plants',
            'Avoid overhead watering; water at the base of plants in the morning',
            'Apply mulch to prevent soil splash onto lower leaves',
            'Practice crop rotation with non-host plants for 2-3 years',
            'Use disease-resistant varieties when available'
        ],
        'prevention': [
            'Plant in well-drained soil with good air circulation',
            'Maintain proper plant spacing (follow variety-specific guidelines)',
            'Avoid working with plants when foliage is wet',
            'Sanitize pruning tools with 70% alcohol or 10% bleach solution between cuts',
            'Apply preventive fungicide sprays during humid weather',
            'Remove plant debris and fallen leaves regularly'
        ],
        'organic_alternatives': [
            'Neem oil spray (5ml/L water) applied weekly',
            'Baking soda solution (1 tablespoon per gallon of water with few drops of liquid soap)',
            'Garlic extract or ginger extract sprays',
            'Biocontrol agents like Trichoderma viride (5g/L) for soil treatment'
        ]
    },
    
    'Healthy': {
        'scientific_name': 'N/A',
        'severity': 'None',
        'description': 'Plant appears healthy with no visible signs of disease or stress.',
        'symptoms': [
            'Vibrant green foliage without discoloration',
            'No spots, lesions, or abnormal growth patterns',
            'Normal leaf texture and structure',
            'Good overall plant vigor'
        ],
        'recommendations': [
            'Continue regular monitoring for early disease detection',
            'Maintain consistent watering schedule - deep watering 2-3 times per week',
            'Apply balanced fertilizer (NPK 10-10-10) every 4-6 weeks during growing season',
            'Ensure adequate sunlight exposure (6-8 hours daily for most plants)',
            'Prune dead or damaged leaves to maintain plant health',
            'Monitor for pest activity weekly',
            'Maintain soil pH between 6.0-7.0 for optimal nutrient uptake'
        ],
        'prevention': [
            'Practice good garden hygiene - remove plant debris regularly',
            'Ensure proper drainage to prevent waterlogging',
            'Rotate crops annually to prevent soil-borne diseases',
            'Apply organic mulch (2-3 inches) to conserve moisture and suppress weeds',
            'Test soil annually and amend based on results',
            'Quarantine new plants for 2 weeks before introducing to garden',
            'Avoid overhead watering during evening hours'
        ],
        'organic_alternatives': [
            'Use compost tea monthly for natural nutrients and disease suppression',
            'Apply vermicompost or well-aged manure every 6-8 weeks',
            'Companion planting with marigolds, basil, or garlic for pest deterrence',
            'Beneficial insect attraction with flowering plants nearby'
        ]
    },
    
    'Leaf_Crinckle': {
        'scientific_name': 'Various viral pathogens',
        'severity': 'Moderate',
        'description': 'Viral disease causing leaf distortion, crinkling, and stunted growth. Often transmitted by insect vectors.',
        'symptoms': [
            'Leaf puckering, crinkling, or curling',
            'Distorted, twisted, or malformed new growth',
            'Yellowing along leaf veins (vein clearing)',
            'Stunted plant growth and reduced vigor',
            'Mosaic patterns or mottling on leaves',
            'Reduced fruit/flower production'
        ],
        'recommendations': [
            'Remove and destroy infected plants immediately - DO NOT COMPOST',
            'Control insect vectors (aphids, whiteflies, thrips) with insecticidal soap',
            'Apply neem oil (5ml/L) or horticultural oil for vector control',
            'Use yellow sticky traps to monitor and reduce flying insect populations',
            'Spray Imidacloprid 17.8% SL (0.5ml/L) for severe aphid infestations',
            'Eliminate weeds that can harbor viruses and vectors',
            'Disinfect tools with 10% bleach solution after working with infected plants',
            'Plant virus-resistant varieties in future plantings'
        ],
        'prevention': [
            'Use certified disease-free planting material only',
            'Install fine mesh netting (40-50 mesh) to exclude insect vectors',
            'Apply reflective mulches (silver plastic) to deter aphids',
            'Maintain robust plant health with proper nutrition and watering',
            'Remove infected plants promptly to prevent spread',
            'Control ant populations as they farm aphids',
            'Avoid planting near known infected areas',
            'Practice 3-4 year crop rotation with non-host plants'
        ],
        'organic_alternatives': [
            'Spray with diluted milk solution (1:9 milk to water ratio) weekly',
            'Use garlic-chili spray for insect vector control',
            'Encourage beneficial insects (ladybugs, lacewings) that feed on vectors',
            'Apply diatomaceous earth around plant base for crawling insects',
            'Neem cake application to soil (100g per plant) for systemic protection'
        ]
    },
    
    'Powdery_Mildew': {
        'scientific_name': 'Erysiphales order (various genera)',
        'severity': 'Moderate',
        'description': 'Fungal disease characterized by white powdery coating on leaves and stems. Thrives in warm days and cool nights with high humidity.',
        'symptoms': [
            'White or gray powdery coating on leaf surfaces, stems, and buds',
            'Patches start small and expand to cover entire leaf surfaces',
            'Leaves may curl, yellow, or become distorted',
            'Premature leaf drop in severe cases',
            'Reduced photosynthesis leading to stunted growth',
            'Affected fruits may have poor quality and flavor'
        ],
        'recommendations': [
            'Remove and destroy severely infected leaves and plant parts',
            'Apply sulfur-based fungicides (Wettable sulfur 80% WP at 3g/L) every 7-10 days',
            'Spray with Trifloxystrobin + Tebuconazole (0.5g/L) for systemic control',
            'Use Potassium bicarbonate spray (1 tablespoon per gallon) weekly',
            'Increase air circulation by pruning dense growth and proper spacing',
            'Water plants at soil level in early morning to reduce humidity',
            'Avoid excessive nitrogen fertilization which promotes susceptible growth',
            'Apply fungicides preventively during favorable disease conditions'
        ],
        'prevention': [
            'Plant in full sun locations with good air movement',
            'Space plants according to recommendations (avoid overcrowding)',
            'Water at the base of plants, never overhead',
            'Prune to open up plant canopy for better air flow',
            'Select powdery mildew-resistant varieties when available',
            'Avoid working with plants when foliage is wet',
            'Clean up and destroy plant debris in fall',
            'Avoid planting in shaded, damp areas'
        ],
        'organic_alternatives': [
            'Baking soda spray (1 tablespoon baking soda + 1 tablespoon vegetable oil + few drops dish soap per gallon of water)',
            'Neem oil solution (2 tablespoons per gallon) sprayed weekly',
            'Milk spray (1 part milk to 9 parts water) applied every 5-7 days',
            'Apple cider vinegar spray (3 tablespoons per gallon of water)',
            'Sulfur dust application in early morning',
            'Compost tea foliar spray for beneficial microorganisms'
        ]
    },
    
    'Yellow_Mosaic': {
        'scientific_name': 'Begomovirus (transmitted by whiteflies)',
        'severity': 'Severe',
        'description': 'Viral disease causing yellow mosaic patterns on leaves. Transmitted primarily by whiteflies. Can cause significant yield loss.',
        'symptoms': [
            'Yellow mosaic or mottled patterns on leaves',
            'Interveinal chlorosis (yellowing between leaf veins)',
            'Severe leaf curling and crinkling',
            'Stunted plant growth and reduced size',
            'Malformed or aborted flowers',
            'Significant reduction in fruit/crop yield (up to 100% loss)',
            'Small, distorted fruits if any develop'
        ],
        'recommendations': [
            'Remove and burn infected plants immediately - CRITICAL to prevent spread',
            'Control whitefly vectors aggressively with insecticides',
            'Spray Acetamiprid 20% SP (0.5g/L) or Thiamethoxam 25% WG (0.5g/L)',
            'Use yellow sticky traps extensively (40-50 traps per acre)',
            'Apply neem oil (5ml/L) with sticker/spreader weekly for vector control',
            'Destroy weed hosts around the field that harbor whiteflies',
            'Install UV-reflecting mulch to repel whiteflies',
            'Implement barrier crops (maize, sorghum) around susceptible crops',
            'Do NOT save seeds from infected plants'
        ],
        'prevention': [
            'Use certified virus-free seeds and transplants',
            'Plant early in the season before whitefly populations peak',
            'Install insect-proof netting (40-50 mesh) over seedbeds and young plants',
            'Use reflective silver mulch to deter whitefly landing',
            'Maintain weed-free areas in and around garden/field',
            'Rogue out (remove) infected plants as soon as symptoms appear',
            'Plant resistant or tolerant varieties when available',
            'Avoid growing susceptible crops continuously',
            'Create physical barriers between old and new crops',
            'Monitor whitefly populations with yellow sticky cards weekly'
        ],
        'organic_alternatives': [
            'Neem seed kernel extract (NSKE 5%) spray every 5 days',
            'Garlic-chili-soap spray for whitefly repellence',
            'Encourage natural predators: ladybugs, lacewings, parasitic wasps',
            'Vertical mulching with neem cake (100g per plant)',
            'Spray botanical oils (karanja oil, pongamia oil at 2%)',
            'Use trap crops like mustard or cotton to attract whiteflies away',
            'Apply wood ash around plant base to deter whiteflies'
        ]
    }
}

try:
    model = load_model(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
    print(f"  Classes: {CLASS_NAMES}")
except Exception as e:
    print(f"✗ Error loading model: {str(e)}")
    print(f"  Make sure '{MODEL_PATH}' exists in the same directory as app.py")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'AgroHelp Flask ML Backend is running!',
        'version': '1.0.0',
        'endpoints': ['/predict/weather', '/predict/disease', '/health']
    })

@app.route('/predict/weather', methods=['POST'])
def predict_weather():
    """
    Dummy weather prediction based on 7 days of historical data
    In real implementation, this would use trained LSTM model
    """
    try:
        data = request.get_json()
        weather_data = data.get('weatherData', [])
        
        print(f"Received weather data for {len(weather_data)} days")
        
        if len(weather_data) != 7:
            return jsonify({'error': 'Expected 7 days of weather data'}), 400
        
        # Extract features for dummy prediction
        temps = [day['avgtemp_c'] for day in weather_data]
        humidities = [day['humidity'] for day in weather_data]
        pressures = [day['pressure_mb'] for day in weather_data]
        
        # Dummy LSTM-like prediction (in reality, this would be model.predict())
        avg_temp = sum(temps) / len(temps)
        avg_humidity = sum(humidities) / len(humidities)
        avg_pressure = sum(pressures) / len(pressures)
        
        # Add some trend and randomness
        temp_trend = (temps[-1] - temps[0]) / 7
        predicted_temp = round(avg_temp + temp_trend + random.uniform(-2, 2), 1)
        
        humidity_trend = (humidities[-1] - humidities[0]) / 7
        predicted_humidity = max(0, min(100, round(avg_humidity + humidity_trend + random.uniform(-5, 5))))
        
        # Generate dummy prediction
        prediction = {
            'date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
            'temperature': predicted_temp,
            'humidity': predicted_humidity,
            'precipitation': round(random.uniform(0, 10), 1),
            'wind_speed': round(random.uniform(10, 25), 1),
            'pressure': round(avg_pressure + random.uniform(-5, 5), 1),
            'confidence': round(random.uniform(75, 95), 1),
            'model_used': 'LSTM-dummy',
            'input_days': len(weather_data)
        }
        
        print(f"Generated prediction: {prediction}")
        return jsonify(prediction)
        
    except Exception as e:
        print(f"Weather prediction error: {str(e)}")
        return jsonify({'error': 'Weather prediction failed', 'message': str(e)}), 500

@app.route('/predict/disease', methods=['POST'])
def predict_disease():
    """
    Plant disease detection using trained EfficientNetB0 model
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': f'Could not load model from {MODEL_PATH}. Please ensure the model file exists.'
            }), 500
        
        # Check if image file is provided
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        print(f"Received image: {file.filename}")
        
        # Read and process image
        image_data = file.read()
        
        try:
            # Open and preprocess image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to model input size (224x224 for EfficientNetB0)
            image = image.resize((224, 224))
            
            # Convert to numpy array
            img_array = np.array(image)
            
            # Apply EfficientNet preprocessing
            img_array = preprocess_input(img_array)
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            print(f"Image preprocessed: Shape={img_array.shape}")
            
        except Exception as img_error:
            return jsonify({
                'error': 'Invalid image file',
                'message': str(img_error)
            }), 400
        
        # Make prediction using the trained model
        try:
            predictions = model.predict(img_array, verbose=0)
            
            # Get the predicted class index
            predicted_class_index = np.argmax(predictions[0])
            
            # Get the predicted class name
            predicted_disease = CLASS_NAMES[predicted_class_index]
            
            # Get confidence score
            confidence = float(predictions[0][predicted_class_index] * 100)
            
            # Get all class probabilities
            all_probabilities = {
                CLASS_NAMES[i]: float(predictions[0][i] * 100)
                for i in range(len(CLASS_NAMES))
            }
            
            print(f"Prediction: {predicted_disease} ({confidence:.2f}%)")
            
            # Get disease information and recommendations
            disease_details = DISEASE_INFO.get(predicted_disease, {})
            
            # Prepare comprehensive response
            prediction = {
                'disease': predicted_disease,
                'confidence': round(confidence, 2),
                'severity': disease_details.get('severity', 'Unknown'),
                'scientific_name': disease_details.get('scientific_name', 'N/A'),
                'description': disease_details.get('description', ''),
                'symptoms': disease_details.get('symptoms', []),
                'recommendations': disease_details.get('recommendations', []),
                'prevention': disease_details.get('prevention', []),
                'organic_alternatives': disease_details.get('organic_alternatives', []),
                'all_probabilities': {k: round(v, 2) for k, v in all_probabilities.items()},
                'model_used': 'EfficientNetB0',
                'processed_at': datetime.now().isoformat()
            }
            
            return jsonify(prediction)
            
        except Exception as pred_error:
            return jsonify({
                'error': 'Prediction failed',
                'message': str(pred_error)
            }), 500
        
    except Exception as e:
        print(f"Disease detection error: {str(e)}")
        return jsonify({
            'error': 'Disease detection failed',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    model_status = 'loaded' if model is not None else 'not loaded'
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': {
            'weather_model': 'LSTM-dummy (ready)',
            'disease_model': f'EfficientNetB0 ({model_status})'
        },
        'supported_formats': ['jpg', 'jpeg', 'png', 'bmp'],
        'disease_classes': CLASS_NAMES if model is not None else []
    })

if __name__ == '__main__':
    print("=" * 60)
    print(" Starting Flask ML Backend...")
    print("=" * 60)
    print(" Available Models:")
    print("   - Weather Prediction: LSTM (dummy)")
    print(f"   - Disease Detection: EfficientNetB0 ({('✓ loaded' if model else '✗ not loaded')})")
    if model:
        print(f" Disease Classes: {len(CLASS_NAMES)} types")
        for i, cls in enumerate(CLASS_NAMES, 1):
            print(f"   {i}. {cls}")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)