import React from 'react';
import { AppBar, Snackbar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { BottomNavigation, BottomNavigationAction, Container } from '@material-ui/core';
import { FiberManualRecord, GroupWork, PlayArrow, Settings as SettingsBtn } from '@material-ui/icons';
import Channel from './Channel';
import Sub from './Sub';
import Cue from './Cue';
import Settings from './Settings';
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
  },
  Title: {
    flexGrow: 1,
  }
}));

export default function App() {

  const [settings, setSettings] = React.useState(false);
  const [page, setPage] = React.useState('chan');
  const [error, setError] = React.useState(false);
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.Title}>
            ETC ION Web Interface
          </Typography>
          <IconButton color="inherit" onClick={() => setSettings(!settings)}>
            <SettingsBtn />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ErrorContext.Provider value={() => setError(true)}>
        <Container maxWidth="xs" className={classes.Container}>
          {
            settings        ? <Settings onDone={() => setSettings(false)} /> :
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
