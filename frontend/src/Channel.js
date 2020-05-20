import React from 'react';
import {Box, Button, Grid, Paper, Slider, Typography} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, EmojiObjects, EmojiObjectsOutlined, Tune } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';

const WideButton = styled(Button)({
  width: '100%',
  height: '60px'
});

export default function Channel() {

  const [slider, setSlider] = React.useState(30);

  const handleSlider = (event, newSlider) => {
    setSlider(newSlider);
  };

  const keylabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', '0', 'C'];
  let keypad = [];
  for(let i=0; i<4; i++) {
    let keys = [];
    for (let j=0; j<3; j++) {
      let idx = i*3 + j;
      keys.push(
        <Grid item xs={4} key={idx}>
          <WideButton variant="outlined" size="large">{keylabels[idx]}</WideButton>
        </Grid>
      )
    }
    keypad.push(
      <Grid container spacing={1} key={i}>
        {keys}
      </Grid>
    )
  }

  return (
    <Box mx={4}>
      <Box textAlign="center" mt={4} mb={4} mx={4}>
        <Paper elevation={0}>
          <Typography variant="h2">
            110
          </Typography>
        </Paper>
      </Box>
      <Slider value={slider} onChange={handleSlider} />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" startIcon={<EmojiObjectsOutlined/>}>Out</WideButton>
        </Grid>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" endIcon={<EmojiObjects/>}>Full</WideButton>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" startIcon={<ArrowBackIos/>}>Prev</WideButton>
        </Grid>
        <Grid item xs={6}>
          <WideButton variant="outlined" color="primary" size="large" endIcon={<ArrowForwardIos/>}>Next</WideButton>
        </Grid>
      </Grid>
      <Box mt={2}>
        {keypad}
      </Box>
      <Box mt={2}>
        <WideButton variant="outlined" color="primary" size="large" startIcon={<Tune/>}>Parameters</WideButton>
      </Box>
    </Box>
  );
}
