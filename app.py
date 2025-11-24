from flask import Flask, request, jsonify, render_template
# from keras._tf_keras.keras.models import load_model
# from keras._tf_keras.keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image

app = Flask(__name__)

classes = ["Abyssinian", "Bengal", "Birman", "Bombay"]
model = load_model("cat_classifier.keras")
input_size = (224, 224)
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(file_stream):
    img = Image.open(file_stream).convert('RGB').resize(input_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get('file')
    
    if not file or file.filename == '':
        return jsonify({"error": "No file uploaded."}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Only JPG, JPEG, and PNG files are allowed."}), 400
    
    try:
        img_array = preprocess_image(file.stream)
        preds = model.predict(img_array)
        predicted_class = classes[np.argmax(preds)]
        return jsonify({"prediction": predicted_class})
    except Exception:
        return jsonify({"error": "Error processing image."}), 500

if __name__ == "__main__":
    app.run(debug=True)