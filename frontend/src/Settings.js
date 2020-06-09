import React from 'react';
import { Button, Box, CircularProgress, TextField } from '@material-ui/core';
import axios from "axios";
import ErrorContext from "./Error";

export default function Settings(props) {

  const throwError = React.useContext(ErrorContext);
  const [settings, setSettings] = React.useState(null);
  const [update, setUpdate] = React.useState(false);

  const handleChange = key => event => {
    let newSettings = {...settings};
    newSettings[key] = event.target.value;
    setSettings(newSettings);
  };

  const handleUpdate = () => {
    setUpdate(true);
    axios.post('/api/setting', settings).then(response => {
      if(response.data === 'disconnected') throwError();
      else {
        props.onDone();
      }
    });
  };

  React.useEffect(() => {
    axios.get('/api/setting').then(response => {
      if(response.data === 'disconnected') throwError();
      else {
        setSettings(response.data);
        console.log(response.data);
      }
    });
  }, [throwError]);

  if(settings == null || update) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }
  else {
    return (
      <>
        <h1>Settings</h1>
        <Box mt={1}>
          <TextField
            label="ION IP"
            fullWidth
            value={settings['ion-ip']}
            onChange={handleChange('ion-ip')}
          />
        </Box>
        <Box mt={1}>
          <TextField
            label="ION Port"
            fullWidth
            value={settings['ion-port']}
            onChange={handleChange('ion-port')}
          />
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Box>
      </>
    );
  }

}
