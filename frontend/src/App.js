import React from 'react';
import { AppBar, Snackbar, Toolbar, Typography } from '@material-ui/core';
import { BottomNavigation, BottomNavigationAction, Container } from '@material-ui/core';
import { FiberManualRecord, GroupWork, PlayArrow } from '@material-ui/icons';
import Channel from './Channel';
import Sub from './Sub';
import Cue from './Cue';
import ErrorContext from './Error';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  BottomNavigation: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  Container: {
    paddingBottom: 66
  },
  Alert: {
    '& div': {
      backgroundColor: theme.palette.error.main,
      color: 'white'
    }
  }
}));

export default function App() {

  const [page, setPage] = React.useState('chan');
  const [error, setError] = React.useState(false);
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">
            ETC ION Web Interface
          </Typography>
        </Toolbar>
      </AppBar>
      <ErrorContext.Provider value={() => setError(true)}>
        <Container maxWidth="xs" className={classes.Container}>
          {
            page === 'chan' ? <Channel/> :
            page === 'sub'  ? <Sub/> :
                              <Cue/>
          }
        </Container>
      </ErrorContext.Provider>
      <BottomNavigation
        value={page}
        onChange={(event, newPage) => {
          setPage(newPage);
        }}
        showLabels
        className={classes.BottomNavigation}
      >
        <BottomNavigationAction label="Channel" value="chan" icon={<FiberManualRecord />} />
        <BottomNavigationAction label="Sub" value="sub" icon={<GroupWork />} />
        <BottomNavigationAction label="Cue" value="cue" icon={<PlayArrow />} />
      </BottomNavigation>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        message="ERROR: Could not connect to ION"
        className={classes.Alert}
      />
    </>
  );

}
