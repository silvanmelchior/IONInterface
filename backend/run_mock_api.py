import json
import time
from flask import Flask, request
from flask_cors import CORS
from config import API_ENDPOINT


REQUEST_DELAY = 1
MOCK_DISCONNECT = False
app = Flask(__name__)
CORS(app)


@app.route(API_ENDPOINT + '/chan/<int:chan_nr>', methods=['POST'])
def chan(chan_nr):
    if MOCK_DISCONNECT:
        return 'disconnected'
    data = json.loads(request.data.decode('utf-8'))
    print('chan', chan_nr, data['param'], data['val'])
    return 'ok'


@app.route(API_ENDPOINT + '/sub')
def sub_get():
    if MOCK_DISCONNECT:
        return 'disconnected'
    time.sleep(REQUEST_DELAY)
    return json.dumps([
        {'nr': 1, 'name': 'Front'},
        {'nr': 2, 'name': 'Back'},
        {'nr': 20, 'name': 'Saal'}
    ])


@app.route(API_ENDPOINT + '/sub/<int:sub_nr>', methods=['POST'])
def sub_post(sub_nr):
    if MOCK_DISCONNECT:
        return 'disconnected'
    data = json.loads(request.data.decode('utf-8'))
    print('sub', sub_nr, data['val'])
    return 'ok'


@app.route(API_ENDPOINT + '/cue')
def cue_get():
    if MOCK_DISCONNECT:
        return 'disconnected'
    time.sleep(REQUEST_DELAY)
    return json.dumps({'cues': [
        {'nr': '10', 'part': 0, 'name': ''},
        {'nr': '11', 'part': 0, 'name': 'Einlass'},
        {'nr': '11.1', 'part': 0, 'name': 'Black'},
        {'nr': '11.5', 'part': 0, 'name': ''},
        {'nr': '30', 'part': 0, 'name': ''},
        {'nr': '40', 'part': 0, 'name': ''},
        {'nr': '40', 'part': 1, 'name': ''},
        {'nr': '40', 'part': 2, 'name': ''},
        {'nr': '50', 'part': 0, 'name': ''}
    ], 'active': '11.1'})


@app.route(API_ENDPOINT + '/cue/fire', methods=['POST'])
def cue_fire():
    if MOCK_DISCONNECT:
        return 'disconnected'
    time.sleep(REQUEST_DELAY)
    data = json.loads(request.data.decode('utf-8'))
    print('cue fire', data['nr'])
    return json.dumps({'active': data['nr']})


@app.route(API_ENDPOINT + '/cue/go', methods=['POST'])
def cue_go():
    if MOCK_DISCONNECT:
        return 'disconnected'
    time.sleep(REQUEST_DELAY)
    print('cue go')
    return json.dumps({'active': '11.5'})


if __name__ == "__main__":
    app.run(host='0.0.0.0')
