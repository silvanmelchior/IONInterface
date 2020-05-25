import React from 'react';
import { Divider, List, Fab, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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

  return (
    <>
      <h1>Cue List 1</h1>
      <List component="nav">
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>10</ListItemIcon>
          <ListItemText primary="&nbsp;" />
        </ListItem>
        <Divider />
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>11</ListItemIcon>
          <ListItemText primary="Einlass" />
        </ListItem>
        <Divider />
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>11.1</ListItemIcon>
          <ListItemText primary="Black" />
        </ListItem>
        <Divider />
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>15</ListItemIcon>
          <ListItemText primary="&nbsp;" />
        </ListItem>
        <Divider />
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>30</ListItemIcon>
          <ListItemText primary="&nbsp;" />
        </ListItem>
        <Divider />
        <ListItem button selected={true} onClick={event => console.log(event)}>
          <ListItemIcon>40</ListItemIcon>
          <ListItemText primary="&nbsp;" />
        </ListItem>
        <Divider />
        <ListItem button selected={false} onClick={event => console.log(event)}>
          <ListItemIcon>50</ListItemIcon>
          <ListItemText primary="&nbsp;" />
        </ListItem>

        <Fab color="primary" className={classes.fab}>
          <PlayArrow />
        </Fab>
      </List>
    </>
  );
}
