import React, {useState, useEffect} from 'react';
import {susepnsify, apiCall} from "../api";
import qs from 'qs';
import {makeStyles} from "@material-ui/core/styles";
import {Options} from './SearchObjectCard'
import axios from 'axios';
import spotify_load_1 from '../Loading/spotify_load_1.gif'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardActionArea,
    CardMedia,
    CardHeader,
    Grid,
    Link,
    Typography, Snackbar
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Alert from "@material-ui/lab/Alert/Alert";
import ImgsViewer from 'react-images-viewer'


const URLServer = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL_DEV : 'https://greyson.pythonanywhere.com'
const useStyles = makeStyles(theme => ({
    card: {
        height: "100%",
        minHeight: "100%",
    },
    media: {
        height: "100%",
        width: "100%",
    },
    loadCard: {
        height: "100%",
        width: "100%",
    },
    loadMedia: {
        height: "100%",
        width: "100%",
    },
    slider : {
        width: "75%",
        margin: 20
    },
}));

function readFileDataAsBase64(file) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsDataURL(file);
    });
}

export default function LoadMosaic({image, playlist, bearer, setSearchState, tiles, playlistInfo, trueColor, pictureId}) {

    const [error, setError] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)

    const [newPhoto, setNewPhoto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewImage, setViewImage] = useState(false)

    useEffect(() => {

        if (!!image && !!playlist && !!bearer) {
            setLoading(true)
            const APIVal = 'createmosaic?' + qs.stringify({playlist, bearer, tiles, trueColor, pictureId})

            setError(false)
            setErrorAlert(false)
            axios({
                method: "POST",
                url: `${URLServer}/api/${APIVal}`,
                data: image,
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
                }
            }).then(res => {
                setNewPhoto(res.data.pictureMosaic)
                setSearchState({pictureMosaic: res.data.pictureMosaic})
                setLoading(false)

                // const newBlob = new Blob([res.data], {type : 'image/jpeg'})
                //
                // readFileDataAsBase64(newBlob).then(res => {
                //     console.log(res)
                //     setNewPhoto(res)
                //     setLoading(false)
                //     setError(false)
                // })


                // const file = (new Blob([res.data]))
                // console.log(file)
                // readFileDataAsBase64(file).then(res => {
                //     // setSearchState({pictureMosaic: res})
                //     setNewPhoto(res)
                //     setLoading(false)
                //     setError(false)
                // })
                //


            }).catch(e => {
                setSearchState({pictureMosaic: null})
                setLoading(false)
                setNewPhoto(null)
                setError(true)
                setErrorAlert(false)
            })

        } else {
            setNewPhoto(null)
        }

    }, [image, playlist, bearer, tiles, trueColor, pictureId])


    return (
        <React.Fragment>
            {!!newPhoto && !loading && !error && (
                <React.Fragment>
                    <MosaicCard setSearchState={setSearchState}
                                src={newPhoto}
                                playlistInfo={playlistInfo}
                                fileName={newPhoto}
                                loading={loading}
                                tiles={tiles}
                                trueColor={trueColor}
                                error={false}
                                setViewImage={() => setViewImage(true)}
                    />
                </React.Fragment>

            )}
            {!newPhoto && !loading && error && (
                <React.Fragment>
                    <MosaicCard setSearchState={setSearchState}
                                src={'https://gifimage.net/wp-content/uploads/2018/11/funny-sad-face-gif-3.gif'}
                                playlistInfo={playlistInfo}
                                fileName={null}
                                loading={loading}
                                tiles={tiles}
                                trueColor={trueColor}
                                error={true}
                                setViewImage={false}

                    />
                </React.Fragment>

            )}
            {!!loading && !error && (
                <React.Fragment>
                    <MosaicCard setSearchState={null}
                                src={null}
                                playlistInfo={playlistInfo}
                                fileName={null}
                                loading={loading}
                                tiles={null}
                                trueColor={null}
                                error={false}
                                setViewImage={null}
                    />
                </React.Fragment>

            )}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={error}
                autoHideDuration={6000}
                onClose={() => setErrorAlert(false)}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setErrorAlert(false)}>
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </React.Fragment>
                }
            >
                <Alert onClose={() => setErrorAlert(false)} severity="error">
                    Error with creating Mosaic, try new settings or start over
                </Alert>
            </Snackbar>
            {!!newPhoto && !loading && !error && (
                <ImgsViewer
                    imgs={[{src: newPhoto}]}
                    currImg={0}
                    isOpen={viewImage}
                    onClose={() => setViewImage(false)}
                />
            )}

        </React.Fragment>


    )
}


export function MosaicCard({setSearchState, src, playlistInfo, fileName, loading = false, tiles = null, trueColor = null, error = false, setViewImage}) {

    const classes = useStyles()


    const download = (src) => {
        let a = document.createElement("a"); //Create <a>
        a.href = src; //Image Base64 Goes here
        a.download = `mosaic.jpeg`
        a.click();
    };

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            justify="center"
            spacing={3}
            style={{padding: 24}}
        >

            <Grid
                item
                xs={12}
                lg={8}
            >
                <Card className={loading ? classes.loadCard : classes.card}
                >

                    {loading && (
                        <Grid
                            container
                            direction={loading ? "row" : "column"}
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item xs={3}>
                                <CardHeader
                                    subheader={
                                        <React.Fragment>

                                            <Typography>May take some time to load</Typography>
                                        </React.Fragment>
                                    }
                                />
                            </Grid>
                            <Grid xs={9}>
                                <CardMedia
                                    className={classes.media}
                                    title="Your Image"
                                    style={{
                                        height: 0,
                                        paddingTop: '56.25%', // 16:9,
                                        marginTop: '30'

                                    }}
                                    image={spotify_load_1}

                                />
                            </Grid>
                        </Grid>
                    )}

                    {
                        !loading && !error && (
                            <CardActions>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Grid item xs={1}>
                                        <Button
                                            startIcon={<ArrowBackIosIcon>Back</ArrowBackIosIcon>}
                                            onClick={() => setSearchState({
                                                playlist: null,
                                                playlistInfo: null
                                            })}>Back</Button>
                                    </Grid>





                                        {!!src & !error && (
                                            <Grid item xs={11} container
                                                  justify={"flex-end"}>

                                                <Grid item >
                                                    <ButtonGroup>


                                                    <Button onClick={() => download(src)} variant="contained"
                                                            color="default"
                                                            endIcon={
                                                                <CloudDownloadIcon>Download</CloudDownloadIcon>}
                                                    >Download</Button>

                                                    <Button onClick={setViewImage}
                                                            variant={"contained"}
                                                            color="primary"
                                                            endIcon={<VisibilityIcon>View</VisibilityIcon>}

                                                    >View</Button>
                                                    </ButtonGroup>
                                                </Grid>
                                            </Grid>

                                        )}

                                </Grid>
                            </CardActions>
                        )
                    }

                    {!loading && !!playlistInfo && !error && (
                        <CardHeader
                            subheader={
                                <React.Fragment>

                                    <Typography>Playlist: <Link
                                        href={playlistInfo.external_urls.spotify}>{playlistInfo.name}</Link></Typography>
                                </React.Fragment>
                            }

                        />
                    )}

                    {!loading && !!error && (
                        <CardHeader
                            subheader={
                                <React.Fragment>

                                    <Typography>There was an error creating this mosaic, try new settings or
                                        a new
                                        photo. Let me know. what happened</Typography>
                                </React.Fragment>
                            }
                        />
                    )}
                    {!loading && (
                        <Options
                            loading={loading}
                            setSearchState={setSearchState}
                            playlistSearchNeeded={false}
                            playlistSearch={null}
                            tiles={tiles}
                            trueColor={trueColor}
                            classes={classes}
                        />
                    )}

                    {!!src && (
                        <CardActionArea onClick={setViewImage}>


                            <CardMedia
                                className={classes.media}
                                title="Your Image"
                                style={{
                                    height: 0,
                                    paddingTop: '100%',
                                    marginTop: '30'

                                }}
                                image={src}
                            />
                        </CardActionArea>
                    )}

                </Card>
            </Grid>
        </Grid>
    )
}