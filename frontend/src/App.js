import React from 'react';
import axios from "axios";
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Container, SvgIcon} from '@material-ui/core';
import Channel from './Channel';
import Sub from './Sub';
import Cue from './Cue';
import { makeStyles } from '@material-ui/core';

function HomeIcon(props) {  // TODO
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const useStyles = makeStyles({
  BottomNavigation: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  Container: {
    paddingBottom: 66
  }
});

export default function App() {
  const [page, setPage] = React.useState('chan');
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
      <Container maxWidth="xs" className={classes.Container}>
        {
          page === 'chan' ? <Channel/> :
          page === 'sub'  ? <Sub/> :
                            <Cue/>
        }
      </Container>
      <BottomNavigation
        value={page}
        onChange={(event, newPage) => {
          setPage(newPage);
        }}
        showLabels
        className={classes.BottomNavigation}
      >
        <BottomNavigationAction label="Channel" value="chan" icon={<HomeIcon />} />
        <BottomNavigationAction label="Sub" value="sub" icon={<HomeIcon />} />
        <BottomNavigationAction label="Cue" value="cue" icon={<HomeIcon />} />
      </BottomNavigation>
    </>
  );
}

axios.post('/api/chan/4', {param: 'intens', val: 100}).then(response => console.log(response.data));
axios.get('/api/sub').then(response => console.log(response.data));
axios.post('/api/sub/2', {val: 40}).then(response => console.log(response.data));
axios.get('/api/cue').then(response => console.log(response.data));
axios.post('/api/cue/fire', {nr: '10.1'}).then(response => console.log(response.data));
axios.post('/api/cue/go').then(response => console.log(response.data));

