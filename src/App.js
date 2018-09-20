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
import CryptoJS from 'crypto-js'

/**
 *
 * @param theme
 * @returns {{root: {flexGrow: number}, fixItem: {padding: number}, rightIcon: {marginLeft: (number|string)}, textField: {marginLeft: (number|string), marginRight: (number|string), width: number}, paper: {padding: number, textAlign: string, color: string}}}
 */
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
        ...theme.mixins.gutters(),
        textAlign: 'center',
        paddingRight: theme.spacing.unit * 2,
        color: theme.palette.text.secondary,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
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

    encodedWord = (word) => {
        let wordSecret = "";
        const wordOfSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        const arr = word.split('');
        let newarr = [];
        for (let i = 0; i < arr.length; i++ ){
            newarr.push(arr[i]);

            for (let w = 0; w < 7; w++) {
                wordSecret += wordOfSymbols.charAt(Math.floor(Math.random() * wordOfSymbols.length));
            }

            let arrSecret = wordSecret.split('');
            for (let s= 0; s < arrSecret.length; s++){
                newarr.push(arrSecret[s])
            }
            wordSecret = ''
        }
        return newarr.join('');

    };

    decodedWord = (word) => {
        let arr = word.split('');
        let newArray = [];
        for (let i = 0; i < arr.length; i++ ){
            if (i % 8 === 0){
                newArray.push(arr[i]);
            }
        }
        return newArray.join('')
    };

    handleClick = () => {
        try {
            const word = this.decodedWord(this.state.textDecoded);
            const bytes = base64.decode(word);
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
            const word = this.encodedWord(encoded)


                this.setState({
                    textEncoded: text,
                    encode: `${word}`
                })

        } catch (e) {
                this.setState({
                    encode: e.message
                })
        }
    };

    encodedText64Characters = event => {
        try {
            const text = event.target.value;

        } catch (e) {

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
                                <Grid item xs={12} md={8} lg={6} className={classes.fixItem} >
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
                                        <Typography variant={"title"} noWrap component="p" color="primary">
                                            {this.state.encode}
                                        </Typography>

                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4} lg={6} className={classes.fixItem}>
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

                                        {this.state.error? <Typography variant="title"  gutterBottom color='error'>
                                                Error: {this.state.decoded}
                                        </Typography>: <Typography variant="title" gutterBottom color='primary' >
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
