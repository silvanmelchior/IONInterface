import json
from flask import Flask

app = Flask(__name__)


@app.route('/api/test')
def hello():
    return json.dumps({'msg': 'Hello World'})


if __name__ == "__main__":
    app.run()
