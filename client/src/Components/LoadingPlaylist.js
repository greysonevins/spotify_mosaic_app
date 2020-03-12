import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
    media: {
        height: 190,
    },
}));

const CardLoad = () => {
    const classes = useStyles();

    return (

        <Card className={classes.card}>

            <CardHeader

                title={
                    <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}}/>

                }
                subheader={<Skeleton animation="wave" height={10} width="40%"/>}
            />
            <Skeleton animation="wave" variant="rect" className={classes.media}/>


            <CardContent>
                <React.Fragment>
                    <Skeleton animation="wave" height={10} style={{marginBottom: 6}}/>
                    <Skeleton animation="wave" height={10} width="80%"/>
                </React.Fragment>

            </CardContent>
        </Card>
    )
}

export default function LoadingPlaylist() {

    console.log("Called")
    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            >


        {
            [...Array(20)].map((key,ind) => {
                return (
                    <Grid
                        key={ind}
                        item
                        xs={12}
                        md={6}
                        lg={4}
                    >
                        <CardLoad/>
                    </Grid>
                )

            })
        }
        </Grid>

    )
}
