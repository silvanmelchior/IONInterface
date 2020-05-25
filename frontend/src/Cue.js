import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export default function Cue() {
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
      </List>
    </>
  );
}
