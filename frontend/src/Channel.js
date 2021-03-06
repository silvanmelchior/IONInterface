import React from 'react';
import { Box, Button, Grid, Paper, Slider, Typography } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, EmojiObjects, EmojiObjectsOutlined } from '@material-ui/icons';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Color from 'color';
import axios from 'axios';
import useCmdQueue from './CmdQueue';
import ErrorContext from './Error';
import { styled } from '@material-ui/core/styles';
import { PARAM_NAMES, POLL_INTERVAL_CHANNEL } from './config';

const WideButton = styled(Button)(args => {

  let color = 'rgba(255, 255, 255, 0.23)';
  if(args.color != null) {
    color = args.theme.palette[args.color].main;
    color = Color(color).alpha(0.5).string();
  }

  return {
    width: '100%',
    height: '60px',
    '&:hover': {
      borderColor: color,
      backgroundColor: 'transparent'
    }
  }

});

export default function Channel() {

  const throwError = React.useContext(ErrorContext);
  const [slider, setSlider] = React.useState(PARAM_NAMES.map(val => 0));
  const [chan, setChan] = React.useState(1);  // either number or null
  const [chanUsed, setChanUsed] = React.useState(true);
  const [params, setParams] = React.useState(false);
  const queueCMD = useCmdQueue(POLL_INTERVAL_CHANNEL);
  const timeoutHandle = React.useRef(null);

  const handleSlider = idx => (event, newSlider) => {
    if(timeoutHandle.current != null) {
      clearTimeout(timeoutHandle.current);
    }
    timeoutHandle.current = setTimeout(() => {
      let vals = [...slider];
      vals[idx] = newSlider;
      setSlider(vals);
      setChanUsed(true);
      if(chan != null) {
        queueCMD(() => {
          axios.post('/api/chan/' + chan, {param: PARAM_NAMES[idx], val: newSlider})
            .then(response => {if(response.data === 'disconnected') throwError()});
        });
      }
    }, 1);
  };

  const handleOut = event => {
    setSlider(PARAM_NAMES.map(val => 0));
    setChanUsed(true);
    if(chan != null) {
      axios.post('/api/chan/' + chan + '/out')
        .then(response => {if(response.data === 'disconnected') throwError()});
    }
  };

  const handleFull = event => {
    let vals = [...slider];
    vals[0] = 100;
    setSlider(vals);
    setChanUsed(true);
    if(chan != null) {
      axios.post('/api/chan/' + chan + '/full')
        .then(response => {if(response.data === 'disconnected') throwError()});
    }
  };

  const handlePrev = event => {
    setSlider(PARAM_NAMES.map(val => 0));
    if(chan == null) setChan(1);
    else if(chan > 1) setChan(chan-1);
    setChanUsed(true);
  };

  const handleNext = event => {
    setSlider(PARAM_NAMES.map(val => 0));
    if(chan == null) setChan(1);
    else setChan(chan+1);
    setChanUsed(true);
  };

  const handleNum = num => event => {
    setSlider(PARAM_NAMES.map(val => 0));
    if(chan == null) {
      if(num !== 0) setChan(num)
    }
    else {
      if(chanUsed && num !== 0) {
        setChan(num)
      }
      else {
        setChan((chan + '' + num)*1)
      }
    }
    setChanUsed(false);
  };

  const handleR = event => {
    setSlider(PARAM_NAMES.map(val => 0));
    if(chan != null) {
      if(chan < 10) setChan(null);
      else setChan((chan + '').slice(0, -1) * 1)
    }
    setChanUsed(false);
  };

  const handleC = event => {
    setSlider(PARAM_NAMES.map(val => 0));
    setChan(null);
    setChanUsed(false);
  };

  return (
    <Box mx={4}>
      <Box textAlign="center" overflow="hidden" mt={4} mb={4} mx={4}>
        <Paper elevation={0}>
          <Typography variant="h2">{chan == null ? '\u00a0' : chan}</Typography>
        </Paper>
      </Box>
      {(params ? PARAM_NAMES : PARAM_NAMES.slice(0, 1)).map((name, idx) => (<Box key={idx}>
        <Box>{params ? name : null}</Box>
        <Slider
          key={name}
          value={slider[idx]}
          onChange={handleSlider(idx)}
          min={0}
          max={100}
          step={1}
          valueLabelDisplay="auto"
        />
      </Box>))}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" startIcon={<EmojiObjectsOutlined/>} onClick={handleOut}>Out</WideButton>
        </Grid>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" endIcon={<EmojiObjects/>} onClick={handleFull}>Full</WideButton>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" startIcon={<ArrowBackIos/>} onClick={handlePrev}>Prev</WideButton>
        </Grid>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" endIcon={<ArrowForwardIos/>} onClick={handleNext}>Next</WideButton>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(1)}>1</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(2)}>2</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(3)}>3</WideButton>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(4)}>4</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(5)}>5</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(6)}>6</WideButton>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(7)}>7</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(8)}>8</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(9)}>9</WideButton>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleR}>R</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleNum(0)}>0</WideButton>
          </Grid>
          <Grid item xs={4}>
            <WideButton variant="outlined" size="large" onClick={handleC}>C</WideButton>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4} textAlign="center">
        <FormControlLabel
          control={
            <Switch
              checked={params}
              onChange={event => setParams(event.target.checked)}
              color="primary"
            />
          }
          label="Parameters"
        />
      </Box>
    </Box>
  );
}
