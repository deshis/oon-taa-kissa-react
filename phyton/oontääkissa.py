import os
from flask import Flask, flash, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
from imageai.Prediction.Custom import CustomImagePrediction
import sys
from keras.backend import clear_session
import tensorflow as tf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('HELLO WORLD')

UPLOAD_FOLDER = os.path.dirname(os.path.realpath(__file__)).replace("\\", "\\\\")
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/upload', methods=['POST'])
def fileUpload():
	target=os.path.join(UPLOAD_FOLDER,'test_docs')
	if not os.path.isdir(target):
		os.mkdir(target)
	logger.info("welcome to upload`")
	file = request.files['file']
	filename = secure_filename(file.filename)
	destination="/".join([target, filename])
	file.save(destination)
	session['uploadFilePath']=destination
	execution_path = os.getcwd()
	dir = os.path.dirname(os.path.realpath(__file__))
	dir.replace("\\", "\\\\")
	prediction = CustomImagePrediction()
	prediction.setModelTypeAsResNet()
	prediction.setJsonPath(dir + r"\model_class.json")
	prediction.setModelPath(dir + r"\model_ex-085_acc-0.966261.h5")
	prediction.loadModel(num_objects=2)

	try:
		predictions, probabilities = prediction.predictImage(dir + r"\\test_docs\\" + filename, result_count=2)
	except:
		tf.keras.backend.clear_session()
		os.remove('test_docs\\' + filename)
		return "error"

	tf.keras.backend.clear_session()

	p1, p2 = zip(predictions, probabilities)

	result=p1[0]
	os.remove('test_docs\\'+filename)
	return result

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0",use_reloader=False)