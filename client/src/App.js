import React, {useState, useEffect, useRef, lazy, Suspense} from 'react';
import {AppBar, Button, Card, CardHeader, CardActions, Grid, CircularProgress, Toolbar, Typography} from "@material-ui/core";
import './App.css';
import {useSearchContext} from "./Contexts/SearchContext";
import CssBaseline from '@material-ui/core/CssBaseline'
import Login from './Components/Login';
import UploadImage from './Components/UploadImage'
import LoadingPlaylist from './Components/LoadingPlaylist'
import SearchObjectCard from './Components/SearchObjectCard'
import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LoadMosaic from './Components/LoadMosaic'
import Info from './Components/Info'

const PlaylistSearch = lazy(() => import('./Components/PlaylistSearch'));
let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL_DEV : 'https://greyson.pythonanywhere.com'

const useStyles = makeStyles(theme => ({
    card: {
        minHeight: 200,
        minWidth: 200,
        margin: theme.spacing(2),
    },
    media: {
        height: 300,
    },
    appbar: {
        flexGrow: 1,
    },
    logout: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
}));

const initialState = {
    pictureMosaic: null,
    pictureId: null,
    playlist: null,
    firstLogin: false,
    playlistSearch: 'Your Top 2019 Songs',
    playlistId: null,
    pictureName: null,
    picture: null,
    type: 'playlist',
    selectedPlaylist: null,
    page: 0,
    code: null,
    Bearer: null,
    RefreshToken: null,
    playlistInfo: null,
    trueColor: true,
    expires_at: null,
    tiles: 12
}



function App(props) {

    const classes = useStyles()
    const {searchState, updateState, resultState, setResultsState, url} = useSearchContext()
    const setSearchState = updateState


    return (

        <React.Fragment>
            <CssBaseline/>
            <div className={classes.appbar}>
            <AppBar position="static" style={{color: "#000000", backgroundColor: "#bbdefb"}}>
                <Toolbar>

                    {searchState.code && (

                            <Button color="inherit" edge="start" className={classes.logout}  onClick={() => setSearchState(null)}>Logout</Button>
                    )}

                    <ThemeProvider theme={theme}>
                        <Typography variant="h6" className={classes.title}>
                            Spotify Mosaic
                        </Typography>
                    </ThemeProvider>


                    <Info firstLogin={searchState.firstLogin && (url.url === '/login' || url.url === '/')}/>


                </Toolbar>
            </AppBar>
            </div>


            {!searchState.code && (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '75vh', maxHeight:'100vh'}}
                >

                    <Grid item>
                        <Card className={classes.card}

                        >
                            <CardHeader
                                title={<Typography noWrap={true}>Login To Spotify to Begin</Typography>}
                            />
                            <CardActions>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Login setSearchState={setSearchState}/>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>

            )}

            {searchState.Bearer && !searchState.picture && (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '75vh', maxHeight:'100vh'}}

                >

                    <Grid item>
                        <Card
                            className={classes.card}
                        >

                            <CardHeader
                                title={<Typography>Upload Image to be Modified</Typography>}
                            />
                            <CardActions>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid
                                        item
                                        xs={5}
                                    >
                                        <UploadImage setSearchState={setSearchState}/>
                                    </Grid>
                                </Grid>
                            </CardActions>

                        </Card>
                    </Grid>
                </Grid>

            )}
            {searchState.Bearer && searchState.picture && !searchState.playlist && (
                <React.Fragment>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        justify="center"
                        style={{padding: 24}}
                    >

                        <Grid item xs={12} md={4} lg={4}>
                            <SearchObjectCard picture={searchState.picture}
                                              src={searchState.picture}
                                              setSearchState={setSearchState}
                                              tiles={searchState.tiles}
                                              playlistSearch={searchState.playlistSearch}
                                              trueColor={searchState.trueColor}
                            />
                        </Grid>
                    </Grid>
                    <Suspense fallback={
                        <LoadingPlaylist/>


                    }>

                        <PlaylistSearch query={searchState.playlistSearch} type={searchState.type}
                                        Bearer={searchState.Bearer} setSearchState={setSearchState}/>
                    </Suspense>
                </React.Fragment>
            )}

            {!!searchState.Bearer && !!searchState.picture && !!searchState.playlist && (
                    <LoadMosaic image={searchState.picture}
                                playlist={searchState.playlist}
                                bearer={searchState.Bearer}
                                setSearchState={setSearchState}
                                tiles={searchState.tiles}
                                playlistInfo={searchState.playlistInfo}
                                trueColor={searchState.trueColor}
                                pictureId={searchState.pictureId}
                    />
            )}


        </React.Fragment>

    );
}

export default App;
