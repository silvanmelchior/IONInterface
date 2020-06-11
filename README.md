# IONInterface

ETC (R) ION (R) web interface using OSC.
Realized with react and material-ui in the frontend and flask as backend.

## Dev Setup

### Backend

Make sure you have npm and python 3.7 with pip installed on your system (in general python versions 3.6+ might work, but are not tested).
Clone the repo and run the following command in the backend folder (create a venv first if desired):

```
pip3 install -r requirements.txt
```

Then create the file _config.py_ with the following content (adjust to your setup):

```
API_ENDPOINT = '/api'                   # API URL, keep this way
FADE_PARAMS = ['red', 'green', 'blue']  # params to set to 100 for full-cmd
```

Also create the file _config.json_ with the following content (adjust to your setup):

```
{
  "ion-ip": "192.168.1.1",                 # adjust to ION IP
  "ion-port": "3032"                       # OSC-Port
}
```

At last, run the backend with

```
python3 run.py
```

### Frontend

I a new terminal, navigate to the frontend folder and execute

```
npm install
```

Then create the file _src/config.js_ with the following content (adjust to your setup):

```
export const PARAM_NAMES = ['intens', 'red', 'green', 'blue', 'white']; // params for channels, 'intens' is always required
export const POLL_INTERVAL_CHANNEL = 500;                               // frequency-interval for channel update with faders (in ms)
export const POLL_INTERVAL_SUB = 500;                                   // frequency-interval for sub update with faders (in ms)
```

At last, run the frontend with

```
npm run start
```

Visit **http://your-ip:3000** if it did not open automatically. You should see the channel screen.

## Deployment

### Backend

To deploy the setup with _gunicorn_ and _nginx_, first make sure the backend auto-starts by adding

```
gunicorn run:app
```

as a start-up command.
On a raspberry pi for example create the file _run.sh_ in the backend folder with the content

```
#!/bin/bash

cd /home/pi/IONInterface/backend      # adjust backend-path
/home/pi/.local/bin/gunicorn run:app  # adjust gunicorn-path
```

Make sure the file is executable and add

```
runuser -l pi -c '/home/pi/IONInterface/backend/run.sh' &
```

to your _/etc/rc.local_. Restart your pi and the backend should be up and (locally) listening on port 8000.


### Frontend

For the frontend navigate to the corresponding folder and run

```
npm run build
```

Then install nginx and adjust the configuration (probably _/etc/nginx/sites-available/default_) to

```
server {
    listen 80;
    server_name 192.168.1.20;  # adjust

    root /home/pi/IONInterface/frontend/build;

    location /api {
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
    }
}
```

Restart nginx and the interface should be up and listening on port 80.
