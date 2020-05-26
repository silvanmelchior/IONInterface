import React from 'react';
import {Divider, List, Fab, ListItem, ListItemIcon, ListItemText, Box, CircularProgress} from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: 56 + theme.spacing(2),
    right: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
}));

export default function Cue() {

  const classes = useStyles();

  const [cues, setCues] = React.useState(null);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    axios.get('/api/cue').then(response => {
      setActive(response.data.active);
      setCues(response.data.cues);
    });
  }, []);

  const handleFire = idx => () => {
    axios.post('/api/cue/fire', {nr: cues[idx].nr}).then(response => {
      setActive(response.data.active);
    });
  };

  const handleGo = () => {
    axios.post('/api/cue/go').then(response => {
      setActive(response.data.active);
    });
  };

  if(cues == null) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }
  else {
    return (
      <>
        <h1>Cue List 1</h1>
        <List component="nav">
          {cues.map((cue, idx) => (
            <React.Fragment key={idx}>
              {idx !== 0 && <Divider/>}
              <ListItem button selected={active === cue.nr} onClick={handleFire(idx)}>
                <ListItemIcon>{cue.nr}</ListItemIcon>
                <ListItemText primary={cue.name !== '' ? cue.name : '\u00a0'}/>
              </ListItem>
            </React.Fragment>
          ))}
          <Fab color="primary" className={classes.fab} onClick={handleGo}>
            <PlayArrow/>
          </Fab>
        </List>
      </>
    );
  }
}
