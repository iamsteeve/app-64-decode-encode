import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import withRoot from './withRoot';
import base64 from 'base-64';
import utf8 from 'utf8';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    fixItem:{
        padding: 32,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },

    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

});



class App extends React.Component {
    state = {
        encode: '',
        decoded: '',
        textEncoded: '',
        textDecoded: '',
        error: false
    };

    handleClick = () => {
        try {
            const bytes = base64.decode(this.state.textDecoded);
            const decoded = utf8.decode(bytes);
            this.setState({
                error: false,
                decoded: decoded
            });
        } catch (e) {
            this.setState({
                error: true,
                decoded: `${e.message? e.message: e}`
            });
        }

    };

    encodedText = event => {
        try {
            const text = event.target.value;
            const bytes = utf8.encode(text);
            const encoded = base64.encode(bytes);

            if (text.length <= 4){
                this.setState({
                    textEncoded: text,
                    encode: encoded
                })
            }
        } catch (e) {
                this.setState({
                    encode: e.message
                })
        }
    };

    decodedText = event => {
        this.setState({
            textDecoded: event.target.value,
        })
    };


    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12} md={6} lg={6} className={classes.fixItem} >
                                    <Paper className={classes.paper} elevation={4}>
                                        <TextField
                                            id="encoded-input"
                                            label="Codificador"
                                            className={classes.textField}
                                            value={this.state.textEncoded}
                                            onChange={this.encodedText}
                                            margin="normal"
                                        />

                                        <Typography variant="display3" noWrap>
                                            Texto codificado
                                        </Typography>
                                        <Typography variant="display1" color="primary">
                                            {this.state.encode}
                                        </Typography>

                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6} lg={6} className={classes.fixItem}>
                                    <Paper className={classes.paper} elevation={4}>
                                        <TextField
                                            id="decoded-input"
                                            label="Decodificador"

                                            className={classes.textField}
                                            value={this.state.textDecoded}
                                            onChange={this.decodedText}
                                            margin="normal"
                                        />

                                        <Button variant="contained" color="secondary" onClick={this.handleClick} className={classes.button}>
                                            Decodificar
                                            <Icon className={classes.rightIcon}>lock_open</Icon>
                                        </Button >


                                        <Typography variant="display3"  noWrap>
                                            Texto decodificado
                                        </Typography>

                                        {this.state.error? <Typography variant="display1" color='error'>
                                                Error: {this.state.decoded}
                                        </Typography>: <Typography variant="display1" color='primary' >
                                            {this.state.decoded}
                                        </Typography>}



                                    </Paper>
                                </Grid>
                            </Grid>

                    </Grid>
                </Grid>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
