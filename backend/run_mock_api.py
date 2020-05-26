import json
import time
from flask import Flask, request


API_ENDPOINT = '/api'
REQUEST_DELAY = 3
app = Flask(__name__)


@app.route(API_ENDPOINT + '/chan/<int:chan_nr>', methods=['POST'])
def chan(chan_nr):
    data = json.loads(request.data.decode('utf-8'))
    print('chan', chan_nr, data['param'], data['val'])
    return 'ok'


@app.route(API_ENDPOINT + '/sub')
def sub_get():
    time.sleep(REQUEST_DELAY)
    return json.dumps([
        {'nr': 1, 'name': 'Front'},
        {'nr': 2, 'name': 'Back'},
        {'nr': 20, 'name': 'Saal'}
    ])


@app.route(API_ENDPOINT + '/sub/<int:sub_nr>', methods=['POST'])
def sub_post(sub_nr):
    data = json.loads(request.data.decode('utf-8'))
    print('sub', sub_nr, data['val'])
    return 'ok'


@app.route(API_ENDPOINT + '/cue')
def cue_get():
    time.sleep(REQUEST_DELAY)
    return json.dumps({'cues': [
        {'nr': '10', 'name': ''},
        {'nr': '11', 'name': 'Einlass'},
        {'nr': '11.1', 'name': 'Black'},
        {'nr': '11.5', 'name': ''},
        {'nr': '30', 'name': ''},
        {'nr': '40', 'name': ''},
        {'nr': '50', 'name': ''}
    ], 'active': '11.1'})


@app.route(API_ENDPOINT + '/cue/fire', methods=['POST'])
def cue_fire():
    data = json.loads(request.data.decode('utf-8'))
    print('cue fire', data['nr'])
    return 'ok'


@app.route(API_ENDPOINT + '/cue/go', methods=['POST'])
def cue_go():
    time.sleep(REQUEST_DELAY)
    print('cue go')
    return json.dumps({'active': '11.5'})


if __name__ == "__main__":
    app.run()
