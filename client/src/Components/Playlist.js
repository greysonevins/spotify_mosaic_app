import React, {useState, useEffect} from 'react';
import {
    Button,
    Card,
    CardMedia,
    CardActionArea,
    CardActions,
    CardHeader,
    Link,
    Tooltip,
    Typography
} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    card: {
        width: "100%",
        maxHeight: 600,
        margin: theme.spacing(0),
    },
    media: {
        height: 190,
    },
}));
export default function Playlist({setSearchState, data}) {
    const classes = useStyles()

    // console.log(data)
    return (
        <Card className={classes.card}>
            <CardHeader
                title={<Typography>{data.name}</Typography>}
                subheader={
                    <React.Fragment>

                        <Typography>{data.owner.display_name} {data.tracks.total}</Typography>
                        <Link href={data.external_urls.spotify} target={'_blank'}>Link Here</Link>
                    </React.Fragment>
                }
            />

            <Tooltip title="Click to Create Mosaic from this Playlist" aria-label="add">
                <React.Fragment>
                <CardActionArea
                    onClick={() => setSearchState({playlist: data.id, playlistInfo: data})}
                >

                    <CardMedia
                        className={classes.media}
                        style={{height: 0, paddingTop: '56.25%', marginTop: 20}}
                        image={!!data.images && data.images.length > 0 ? data.images[0].url : null}
                    />
                </CardActionArea>
                <CardActions>
                    <Button onClick={() => setSearchState({playlist: data.id, playlistInfo: data})} variant={'outlined'}>Select
                        Playlist</Button>
                </CardActions>
                </React.Fragment>
            </Tooltip>

        </Card>

    )

}