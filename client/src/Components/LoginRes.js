import React, {useState, useEffect} from 'react';
import {Link} from "@material-ui/core";
import {fetchSpotifyAPI, susepnsify} from "../api";
import qs from 'qs';


const URLServer = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'greyson.pythonanywhere.com'


export default function LoginRes({code}) {

    const redirect = `${URLServer}/login`
    const data = {grant_type: "authorization_code", redirect_uri:redirect , code, client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID, client_secret: process.env.REACT_APP_SPOTIFY_SECRET}
    const APIVAL = qs.stringify(data)

    const URL = `https://accounts.spotify.com/api/token`
    fetch(URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'

        },
        body: APIVAL
    }).then(res => {
            console.log(res.body)
            return res.json()
        }
    )

    // const loginSuspense =
    // let data = loginSuspense.read()
    // console.log(data)


    return (
        <Link href={URL}>Login</Link>
    )

}