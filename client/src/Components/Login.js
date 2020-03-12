import React, {useState, useEffect} from 'react';
import {Link, Button} from "@material-ui/core";
import {fetchSpotifyAPI, susepnsify} from "../api";
import qs from 'qs';


const urlHead = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' :  process.env.REACT_APP_API_URL_PROD

export default function Login({setSearchState}) {
    const redirect= `${urlHead}/login`
    console.log(redirect)
    const APIVAL = qs.stringify({client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID, client_secret:process.env.REACT_APP_SPOTIFY_SECRET, response_type:'code', redirect_uri: redirect, scope:'user-read-private user-read-email'})
    const URL = `https://accounts.spotify.com/authorize?${APIVAL}`
    // const loginSuspense =
    // let data = loginSuspense.read()
    // console.log(data)


    return (
       <Link href={URL}><Button  variant={'contained'} style={{backgroundColor:'#1ed761', minWidth: '100%', minHeight: '5vh'}}>Login</Button></Link>
    )

}