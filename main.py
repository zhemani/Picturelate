from flask import Flask, session, url_for
from flask import request, Response
import json
import pprint
from clarifai.rest import ClarifaiApp

from ast import literal_eval
import base64
import re
import os
from google.cloud import vision
from google.cloud.vision import types
import io
from google.cloud import texttospeech
import os.path

from google.cloud import translate
translate_client = translate.Client()

#from clarifai.rest import Image as ClImage

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/'


client = vision.ImageAnnotatorClient()


api = ClarifaiApp(api_key='')
model =  api.public_models.general_model
model.model_version = 'aa7f35c01e0642fda5cf400f543e7c40'

def speak(word, language):
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.types.SynthesisInput(text = word)
    voice = texttospeech.types.VoiceSelectionParams(
        language_code = language,
        ssml_gender = texttospeech.enums.SsmlVoiceGender.NEUTRAL
    )

    audio_config = texttospeech.types.AudioConfig(
        audio_encoding = texttospeech.enums.AudioEncoding.MP3)
    response = client.synthesize_speech(synthesis_input, voice, audio_config)
    #path_name = app.config['UPLOAD_FOLDER']
    #file1 = open(path_name, 'w')
    # file.save(os.path.join(save_path, output.mp3))
    return response.audio_content


def translate_word(word, language):
    translation = translate_client.translate(word, target_language = language)
    print(word + " translates to " + translation['translatedText'])
    if word != translation['translatedText']:
        values = {'orig': word, 'text': translation['translatedText']} 
        
        return values


@app.route('/', methods=['GET', 'POST'])
def root():
    return 'hello'

@app.route('/test', methods=['GET','POST'])
def testing():
    new_str = request.get_data().decode('utf-8')
    python_dict = literal_eval(new_str)
    lang = python_dict['language']
    session['language'] = lang
    print(session['language'])
    return 'CAMERA'

@app.route('/picture', methods=['GET','POST'])
def picturefile():
    #picturecopy = request.get_data().decode('utf-8')
#    picturecopy = json.loads(request.get_data())
#    print(picturecopy)
#    #python_dict = literal_eval(picturecopy)
#    imagefile = picturecopy['picturefile']
    
    imagefile = request.get_data()
    #mg = api.inputs.create_image_bytes(base64_bytes=imagefile)
    imgdata = base64.b64decode(imagefile)
    #filename = 'some_image.jpg'
#    with open(filename, 'wb') as f:
#        f.write(imgdata)
#        f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    with open("some_image.jpg", "wb") as fh:
        fh.write(imgdata)
    with io.open("some_image.jpg", 'rb') as image_file:
        content = image_file.read()
    image = types.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations
    print(labels)
    language = session["language"]
    translated = {}
    i = 0
    for label in labels:
        if label.score > 0.5 and i < 5:
            translated[i] = translate_word(label.description, language)
            i = i + 1
    print(translated)
    
    #image = ClImage(file_obj=img)
    #response = model.predict_by_base64(imagefile)
#    i = 0
#    for element in response['outputs'][0]['data']['concepts']:
#        if element['value'] > 0.95:
#            i = i + 1
#            #if i < 3:
#            print(element)
    return json.dumps(translated)

@app.route('/speech', methods=['GET','POST'])
def speechfile():
    data = request.get_data()
    response = speak(data,session['language'])
    
    return Response(response, mimetype='audio/mp3')


app.secret_key = 'hackwestern5'

if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')
