import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import {Divider, Grid, Link, Tooltip} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        height: 300,
        flexGrow: 1,
        minWidth: 300,
        transform: 'translateZ(0)',
        '@media all and (-ms-high-contrast: none)': {
            display: 'none',
        },
    },
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function Info({firstLogin}) {

    const classes = useStyles()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(firstLogin)
    }, [firstLogin])

    return (

        <React.Fragment>

            <Tooltip title="Get Info On App">

                <IconButton
                    size={'medium'}
                    color="inherit"
                    edge="start"
                >
                    <InfoIcon size={'medium'} onClick={() => setOpen(true)}/>
                </IconButton>
            </Tooltip>

            <Dialog open={open}
                    onClose={() => setOpen(false)}
                    scroll={'paper'}
                    aria-labelledby={'scroll-dialog-info'}
            >
                <DialogTitle>About Spotify Mosaic</DialogTitle>
                <DialogContent>
                    <DialogContentText dividers={true}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">

                            <Grid item={3}>
                                <b>App by Greyson Nevins-Archer </b>
                            </Grid>
                            <Divider orientation="vertical" flexItem/>
                            <Grid item={3}>

                                <Link href={'https://github.com/greysonevins/spotify-album-mosaic'} target={'_blank'}>Git
                                    Repo</Link>
                            </Grid>
                            <Divider orientation="vertical" flexItem/>
                            <Grid
                                item={3}
                            >

                                <Link href={'mailto:greyson.nevins@gmail.com'} target={'_blank'}
                                      rel="noopener noreferrer">Email</Link>
                            </Grid>
                        </Grid>
                        <br/>
                        <p id="app-info-description">
                            This application uses your photo to create a mosaic from a selected Spotify playlist and
                            image you provide. Spotify authentication is
                            needed to get the seleced playlist you want.
                            How it works is by taking your photo and dividing into tile values based on the number of
                            tiles you want and generates an average color value for that pixel tile.
                            Then based on that average color it will find the most similar cover photo average color to
                            replace the image tile with an album cover.
                            If you use True Color, a random cover album will be chosen and have a filter added to it to
                            generate a more true color mosaic tile.
                        </p>
                        <br/>
                        <br/>

                        <b>Playlist</b>
                        <p>
                            Search for a playlist that you want to create a mosaic from and the application will grab
                            all cover photos from this playlist to create the mosaic from.
                            Playlist's with more songs will slow down the application speed but potenitally have more
                            accurate colors to represent your image.
                        </p>
                        <b>Tiles</b>
                        <p>
                            You can change the amount of tiles generated to see the mosaic represented in more or less
                            cover photos.
                        </p>
                        <br/>
                        <b>True Color</b>
                        <p>
                            The True Color switch allows you to switch between two features of how the mosaic is created.
                            Without True Color,
                            the application generates tiles to match the destination image based on the provided cover
                            photos from the playlist by finding the most similiar average color
                            of the tile and the most similar average color of the playlist.
                            <b>With True Color</b> instead of matching average color values, the tile is created by
                            adding a filter to a random cover album photo to match the image's average color value for
                            that pixel.
                            This feature will alter the album cover photo but perserve the truest color of the original
                            photo.
                        </p>
                        <br/>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        color={'secondary'}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )

}