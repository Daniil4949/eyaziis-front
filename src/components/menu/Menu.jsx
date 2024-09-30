// src/components/Menu.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Button, Toolbar, Typography} from '@mui/material';

const Menu = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    My Application
                </Typography>
                <Button color="inherit" component={Link} to="/create-document">Add document</Button>
                <Button color="inherit" component={Link} to="/">Documents</Button>
                {/*<Button color="inherit" component={Link} to="/weight-coefficients">Weight Coefficients</Button>*/}
                {/*<Button color="inherit" component={Link} to="/logical-search">Logical Search</Button>*/}
                 <Button color="inherit" component={Link} to="/neural-method">Neural Method</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Menu;
