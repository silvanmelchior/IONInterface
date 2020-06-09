import json
import time
import socket
from flask import Flask, request
from flask_cors import CORS
from config import API_ENDPOINT, ION_PORT, ION_IP, FADE_PARAMS
from osc import OSCClient


app = Flask(__name__)
CORS(app)


def _connect():
    client = OSCClient(ION_IP, ION_PORT)
    try:
        client.connect()
    except (socket.timeout, TimeoutError, ConnectionRefusedError):
        return None
    return client


@app.route(API_ENDPOINT + '/chan/<int:chan_nr>', methods=['POST'])
def chan(chan_nr):
    client = _connect()
    if client is None:
        return 'disconnected'

    data = json.loads(request.data.decode('utf-8'))
    if data['param'] == 'intens':
        client.send_msg(f'/eos/chan/{chan_nr}', data['val'])
    else:
        client.send_msg(f'/eos/chan/{chan_nr}/param/' + data['param'], data['val'])

    client.close()
    return 'ok'


def _fade_in_out(chan_nr, fade_in):
    client = _connect()
    if client is None:
        return 'disconnected'

    client.send_msg(f'/eos/chan', chan_nr)
    msg = ''
    while True:
        msg = client.recv_msg('/eos/out/active/chan')[1][0][1]
        if msg != '':
            break

    if fade_in:
        if 'Generic Dimmer' not in msg:
            for param in FADE_PARAMS:
                client.send_msg(f'/eos/chan/{chan_nr}/param/{param}', 100)

    val = int(msg.split('[')[1].split(']')[0])
    if fade_in:
        while True:
            val += 10
            if val >= 100:
                val = 100
            client.send_msg(f'/eos/chan/{chan_nr}', val)
            time.sleep(0.05)
            if val >= 100:
                break
    else:
        while True:
            val -= 10
            if val <= 0:
                val = 0
            client.send_msg(f'/eos/chan/{chan_nr}', val)
            time.sleep(0.05)
            if val <= 0:
                break

    time.sleep(0.5)
    client.close()
    return 'ok'


@app.route(API_ENDPOINT + '/chan/<int:chan_nr>/full', methods=['POST'])
def chan_full(chan_nr):
    return _fade_in_out(chan_nr, True)


@app.route(API_ENDPOINT + '/chan/<int:chan_nr>/out', methods=['POST'])
def chan_out(chan_nr):
    return _fade_in_out(chan_nr, False)


@app.route(API_ENDPOINT + '/sub')
def sub_get():
    client = _connect()
    if client is None:
        return 'disconnected'

    client.send_msg('/eos/get/sub/count')
    sub_count = client.recv_msg('/eos/out/get/sub/count')[1][0][1]
    subs = []
    for i in range(sub_count):
        client.send_msg(f'/eos/get/sub/index/{i}')
        while True:
            ret = '/eos/out/get/sub'
            ans = client.recv_msg(ret)
            if ans[0][len(ret)+1:].split('/')[1] == 'list':
                break
        subs.append({'nr': int(ans[0].split('/')[5]), 'name': ans[1][2][1]})

    client.close()
    return json.dumps(subs)


@app.route(API_ENDPOINT + '/sub/<int:sub_nr>', methods=['POST'])
def sub_post(sub_nr):
    client = _connect()
    if client is None:
        return 'disconnected'

    data = json.loads(request.data.decode('utf-8'))
    client.send_msg(f'/eos/sub/{sub_nr}', data['val'] / 100)

    client.close()
    return 'ok'


@app.route(API_ENDPOINT + '/cue')
def cue_get():
    client = _connect()
    if client is None:
        return 'disconnected'

    ret = '/eos/out/active/cue'
    ans = client.recv_msg(ret)
    if ans[0] != ret:
        active = ans[0].split('/')[6]
    else:
        active = ''

    client.send_msg('/eos/get/cue/1/count')
    cue_count = client.recv_msg('/eos/out/get/cue/1/count')[1][0][1]
    cues = []
    for i in range(cue_count):
        client.send_msg(f'/eos/get/cue/1/index/{i}')
        while True:
            ret = '/eos/out/get/cue/1'
            ans = client.recv_msg(ret)
            if ans[0][len(ret)+1:].split('/')[2] == 'list':
                break
        cues.append({'nr': ans[0].split('/')[6], 'part': ans[0].split('/')[7], 'name': ans[1][2][1]})

    client.close()
    return json.dumps({'cues': cues, 'active': active})


@app.route(API_ENDPOINT + '/cue/fire', methods=['POST'])
def cue_fire():
    client = _connect()
    if client is None:
        return 'disconnected'

    data = json.loads(request.data.decode('utf-8'))
    client.send_msg('/eos/cue/fire', data['nr'])

    client.close()
    return json.dumps({'active': data['nr']})


@app.route(API_ENDPOINT + '/cue/go', methods=['POST'])
def cue_go():
    client = _connect()
    if client is None:
        return 'disconnected'

    ans = client.recv_msg('/eos/out/pending/cue')
    pending = ans[0].split('/')[6]
    client.send_msg('/eos/key/go_0')

    client.close()
    return json.dumps({'active': pending})


if __name__ == "__main__":
    app.run()
