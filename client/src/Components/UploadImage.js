import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Backdrop, Button, CircularProgress, Snackbar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import { v4 as uuidv4 } from 'uuid';
import EXIF from 'exif-js';
import { getBase64Strings } from 'exif-rotate-js/lib';

const URLAPI = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL_DEV : 'https://greyson.pythonanywhere.com'


const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function readFileDataAsBase64(e) {
    const file = e.target.files[0];

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

export default function UploadImage({setSearchState}) {
    const classes = useStyles();


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const onDrop = (picture) => {

        let exifFile = true
        setLoading(true)
        EXIF.getData(picture.target.files[0], function() {
            let exifData = EXIF.pretty(this);
            if (exifData) {
                exifFile = true

            } else {
                exifFile = false
            }
        });


        if (! exifFile){
            // console.log(picture.target.files[0])
            readFileDataAsBase64(picture).then(res => {
                setSearchState({picture: res, pictureId: uuidv4()})
                setLoading(false)

                // axios({
                //     method: "POST",
                //     url: `${URLAPI}/api/image`,
                //     data: res,
                //     headers: {
                //         'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
                //     }
                // }).then(res => {
                //     setSearchState({picture: res.data.image_id})
                //     setLoading(false)
                //
                // }).catch(res => {
                //     setSearchState({picture: null})
                //     setLoading(false)
                //     setError(true)
                // })

            }).catch(e => {
                setSearchState({picture: null, pictureId: null})
                setLoading(false)
                setError(true)
            })
        } else {
            getBase64Strings(picture.target.files, { maxSize: 2000 }).then(res => {
                console.log(res)
                setSearchState({picture: res[0], pictureId: uuidv4()})
                setLoading(false)

            }).catch(e => {
                console.log(e)
                setSearchState({picture: null, pictureId: null})
                setError(true)
                setLoading(false)
            })
        }


        // console.log(data.get('image'))

        // setData(dataForm);

//
    }

    useEffect(() => {
        console.log(data)
        if (!!data) {
            // readmeStream.on('error', console.log)
// // const {size} = fs.statSync('test.jpeg')



        }
//
    }, [data])

    return (
        <React.Fragment>
            <input
                accept="image/*"
                style={{display: 'none'}}
                id="raised-button-file"
                type="file"
                onChange={onDrop}
            />
            <label htmlFor="raised-button-file">
                <Button variant={'contained'} color={'primary'} component="span">
                    Upload
                </Button>

            </label>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={error}
                autoHideDuration={6000}
                onClose={() => setError(false)}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setError(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            >
                <Alert onClose={() => setError(false)} severity="error">
                    Error Uploading Selected Image
                </Alert>
            </Snackbar>
        </React.Fragment>


    )

}