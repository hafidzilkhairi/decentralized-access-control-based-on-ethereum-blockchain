import React from 'react';
import './App.css';
import { AppBar, IconButton, Typography, Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

function App() {
  return (
    <div style={{
      display: "flex",
    }}>
      <AppBar>
        <IconButton edge="start" style={{}} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6" style={{}}>
          News
        </Typography>
        <Button color="inherit">Login</Button>
      </AppBar>
    </div>
  );
}

export default App;
