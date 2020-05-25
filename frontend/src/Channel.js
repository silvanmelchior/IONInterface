import React from 'react';
import { Box, Button, Grid, Paper, Slider, Typography } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, EmojiObjects, EmojiObjectsOutlined, Tune } from '@material-ui/icons';
import Color from 'color';
import { styled } from '@material-ui/core/styles';

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

  const [slider, setSlider] = React.useState(0);
  const [chan, setChan] = React.useState(1);  // either number or null
  const [chanUsed, setChanUsed] = React.useState(true);

  const handleSlider = (event, newSlider) => {
    setSlider(newSlider);
    setChanUsed(true);
    if(chan != null) {
      console.log(newSlider);
    }
  };

  const handleOut = event => {
    setSlider(0);
    setChanUsed(true);
    if(chan != null) {
      console.log('out');
    }
  };

  const handleFull = event => {
    setSlider(100);
    setChanUsed(true);
    if(chan != null) {
      console.log('full');
    }
  };

  const handlePrev = event => {
    setSlider(0);
    if(chan == null) setChan(1);
    else if(chan > 1) setChan(chan-1);
    setChanUsed(true);
  };

  const handleNext = event => {
    setSlider(0);
    if(chan == null) setChan(1);
    else setChan(chan+1);
    setChanUsed(true);
  };

  const handleNum = num => event => {
    setSlider(0);
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
    setSlider(0);
    if(chan != null) {
      if(chan < 10) setChan(null);
      else setChan((chan + '').slice(0, -1) * 1)
    }
    setChanUsed(false);
  };

  const handleC = event => {
    setSlider(0);
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
      <Slider
        value={slider}
        onChange={handleSlider}
        min={0}
        max={100}
        step={1}
        valueLabelDisplay="auto"
      />
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
      <Box mt={2}>
        <WideButton variant="outlined" color="primary" size="large" startIcon={<Tune/>}>Parameters</WideButton>
      </Box>
    </Box>
  );
}
