import axios from 'axios';

const URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL_DEV : 'https://greyson.pythonanywhere.com'

const apiCall = axios.create({
    baseURL: `${URL}/api/`
});


export function fetchAPI(APIVAL, api = null) {

    const URLAPI = `${URL}/api/${APIVAL}`


    return fetch(URLAPI).then(res =>
        res.json()
    )
}

export function fetchSpotifyAPI(APIVAL, headers={}, context = 'search', url='') {


    let URL;
    if (! url) {
        URL = 'https://api.spotify.com/v1'

    } else {
        URL = url
    }

    const URLAPI = `${URL}/${context}?${APIVAL}`
    return fetch(URLAPI, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers

        }
    }).then(res => {
            return res.json()
        }
    )

}


export function susepnsify(promise) {
    let status = 'pending';
    let result;

    let suspender = promise.then(
        response => {
            status = "success";
            result = response;
        },
        error => {
            status = "error";
            result = error
        }
    );
    return {
        read() {
            if (status === "pending") {
                throw suspender;
            }
            if (status === "error") {
                throw result;
            }
            if (status === "success") {
                return result;
            }
        }
    };
}


export {apiCall}