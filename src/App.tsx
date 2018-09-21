import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import withRoot from './withRoot';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import {WithStyles} from "@material-ui/core/es";


const styles = (theme: Theme) => createStyles({
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

interface StateApp {
    encode: string;
    decoded: string;
    textEncoded: string;
    textDecoded: string;
    error: boolean;
}
interface PropsApp extends WithStyles<typeof styles>{
    classes: {
        root: string;
        fixItem: string;
        rightIcon: string;
        textField: string;
        paper: string;
    };
}



class App extends React.Component<PropsApp, StateApp> {
    state: StateApp = {
        encode: '',
        decoded: '',
        textEncoded: '',
        textDecoded: '',
        error: false
    };

    encodedWord = (word: string) => {
        let wordSecret = "";
        const wordOfSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let arr: Array<string> = [];
        arr = word.split('');
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

    decodedWord = (word: string) => {
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

    encodedText = (event: React.FormEvent<EventTarget>) => {
        try {
            const target = event.target as HTMLInputElement;

            const text = target.value;
            const bytes = utf8.encode(text);
            const encoded = base64.encode(bytes);
            const word = this.encodedWord(encoded);


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





    decodedText = (event: React.FormEvent<EventTarget>) => {
        const target = event.target as HTMLInputElement;
        this.setState({
            textDecoded: target.value,
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

                                        <Button variant="contained" color="secondary" onClick={this.handleClick} >
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




export default withRoot(withStyles(styles)(App));
