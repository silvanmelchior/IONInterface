import React from 'react';
import { Box, Slider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

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

  const [slider, setSlider] = React.useState(30);
  const handleSlider = (event, newSlider) => {
    setSlider(newSlider);
  };

  return (
    <Box>

      <Box display="inline-block" textAlign="center" className={classes.sub} mt={8}>
        <Box className={classes.slider}>
          <Slider
            orientation="vertical"
            value={slider}
            onChange={handleSlider}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box className={classes.labelnum} mt={1}>
          1
        </Box>
        <Box className={classes.labelname}>
          Front
        </Box>
      </Box>

      <Box display="inline-block" textAlign="center" className={classes.sub} mt={8}>
        <Box className={classes.slider}>
          <Slider
            orientation="vertical"
            value={slider}
            onChange={handleSlider}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box className={classes.labelnum} mt={1}>
          2
        </Box>
        <Box className={classes.labelname}>
          Back
        </Box>
      </Box>

    </Box>
  );
}
