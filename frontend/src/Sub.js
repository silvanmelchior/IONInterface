import React from 'react';
import { Box, CircularProgress, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useCmdQueue from './CmdQueue';
import axios from 'axios';
import ErrorContext from './Error';
import { POLL_INTERVAL_SUB } from './config';

const useStyles = makeStyles({
  sub: {
    display: "inline-block",
    width: 60
  },
  slider: {
    height: 250
  },
  labelnum: {
    opacity: 0.5
  },
  labelname: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

export default function Sub() {

  const classes = useStyles();
  const throwError = React.useContext(ErrorContext);

  const [subs, setSubs] = React.useState(null);
  const [slider, setSlider] = React.useState(null);

  const queueCMD = useCmdQueue(POLL_INTERVAL_SUB);

  React.useEffect(() => {
    axios.get('/api/sub').then(response => {
      if(response.data === 'disconnected') throwError();
      else {
        setSlider(response.data.map(val => 0));
        setSubs(response.data);
      }
    });
  }, [throwError]);

  const handleSlider = idx => (event, newSlider) => {
    let vals = [...slider];
    vals[idx] = newSlider;
    setSlider(vals);
    queueCMD(() => {
      axios.post('/api/sub/' + subs[idx].nr, {val: newSlider})
        .then(response => {if(response.data === 'disconnected') throwError()});
    })
  };

  if(subs == null) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }
  else {
    return (
      <Box>
        {subs.map((sub, idx) => (
          <Box display="inline-block" textAlign="center" className={classes.sub} mt={8} key={idx}>
            <Box className={classes.slider}>
              <Slider
                orientation="vertical"
                value={slider[idx]}
                onChange={handleSlider(idx)}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box className={classes.labelnum} mt={1}>
              {sub.nr}
            </Box>
            <Box className={classes.labelname}>
              {sub.name}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
}
