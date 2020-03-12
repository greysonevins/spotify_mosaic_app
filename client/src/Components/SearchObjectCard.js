import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Divider,
    Grid,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    Slider,
    Switch,
    Typography,
    Tooltip
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';

import SearchPlaylist from './SearchPlaylist'
import CardHeader from "@material-ui/core/CardHeader";
import {apiCall, fetchAPI} from "../api";
import Skeleton from "@material-ui/lab/Skeleton";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Alert from "@material-ui/lab/Alert/Alert";


const useStyles = makeStyles(theme => ({
    card: {
        minWidth: "100%",
    },
    slider: {
        width: "100%"
    },
    media: {
        height: 300,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}


const Options = ({loading, setSearchState, playlistSearchNeeded=null, playlistSearch, tiles, trueColor, classes})=> {
    const [sliderCurrent, setSliderCurrent] =useState(tiles)


    return (
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

                {! loading && !! playlistSearchNeeded && (
                    <SearchPlaylist setSearchState={setSearchState} playlistSearch={playlistSearch}/>

                )}
            </Grid>
            <Grid
                item
                xs={12}
                style={{paddingTop: 10}}
            >
                <React.Fragment>

                    <InputLabel id="demo-simple-select-label" className={classes.slider}>Number of Tiles : {tiles} </InputLabel>


                    <Slider className={classes.slider} ValueLabelComponent={ValueLabelComponent} min={3} max={100} onChange={(e, v) => setSliderCurrent(v)} onChangeCommitted={(e, v) => setSearchState({tiles:v})} defaultValue={tiles}/>



                </React.Fragment>
            </Grid>
            <Divider style={{minWidth: 300}}  />

            <Grid
                item
                xs={12}
                style={{margin: 20}}
            >
                <InputLabel id="true-color">True Color Changes a random album cover to match the pixel color of the image</InputLabel>

                <CardActions>

                    <Typography>True Color: {trueColor ? 'On' : 'Off'}</Typography>
                    <Switch
                        checked={trueColor}
                        onChange={() => setSearchState({trueColor: !trueColor})}
                        value="checkedA"
                    />
                </CardActions>
            </Grid>
        </Grid>
    )
}
export default function SearchObjectCard({picture, src, setSearchState, tiles, playlistSearch, trueColor}) {

    const [loading, setLoading] = useState(false)

    const classes = useStyles();

    // const [error, setError] = useState(false)

    // const rotate = () => {
    //     const APIVal = 'rotate?' + qs.stringify({picture})
    //     setLoading(true)
    //     fetchAPI(APIVal).then(res => {
    //         setSearchState({picture: res.picture})
    //         setLoading(false)
    //     }).catch(e => {
    //         setLoading(false)
    //     })
    //
    //
    // }

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardActions>
                    <Button disabled={loading} variant={"contained"} color={"secondary"} startIcon={<DeleteIcon>New Image</DeleteIcon>} onClick={(e) => setSearchState({picture: null})}>New
                        Image</Button>
                </CardActions>
                <CardHeader
                    subheader={
                        !!playlistSearch && (<Typography><b>Current Search:</b> {playlistSearch}</Typography>)
                    }
                />


                {loading ?
                    <Skeleton animation="wave" variant="rect" className={classes.loadMedia}/>

                    :
                    <CardMedia
                        style={{
                            paddingTop: '56.25%', // 16:9,
                            marginTop:'30'

                        }}
                        className={classes.media}
                        image={src}
                        title="Your Image"
                    />
                }

                {/*<CardActions>*/}
                {/*    <IconButton size={'medium'}>*/}
                {/*        <Rotate90DegreesCcwIcon disabled={loading} size={'medium'} onClick={rotate}/>*/}
                {/*    </IconButton>*/}
                {/*</CardActions>*/}
                <CardContent>
                   <Options
                       loading={loading}
                       setSearchState={setSearchState}
                       playlistSearchNeeded={true}
                       playlistSearch={playlistSearch}
                       tiles={tiles}
                       trueColor={trueColor}
                       classes={classes}
                       />

                </CardContent>
            </Card>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            {/*<Snackbar*/}
            {/*    anchorOrigin={{*/}
            {/*        vertical: 'top',*/}
            {/*        horizontal: 'right',*/}
            {/*    }}*/}
            {/*    open={error}*/}
            {/*    autoHideDuration={6000}*/}
            {/*    onClose={() => setError(false)}*/}
            {/*    action={*/}
            {/*        <React.Fragment>*/}
            {/*            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setError(false)}>*/}
            {/*                <CloseIcon fontSize="small" />*/}
            {/*            </IconButton>*/}
            {/*        </React.Fragment>*/}
            {/*    }*/}
            {/*>*/}
            {/*    <Alert onClose={() => setError(false)} severity="error">*/}
            {/*        Error Rotating Image*/}
            {/*    </Alert>*/}
            {/*</Snackbar>*/}
        </React.Fragment>
    )
}

export {Options}