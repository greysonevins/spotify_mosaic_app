import React, {useContext, useEffect, useState} from 'react';
import qs from 'qs';
import useAPICall from '../hooks/useAPICall'
import _ from 'lodash'
import {useLocalStorage} from "@greysonevins/use-local-storage";


const URLServer = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'greyson.pythonanywhere.com'


const initialState = {
    pictureId: null,
    pictureMosaic: null,
    firstLogin: false,
    playlist: null,
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

const initialResultsState = {
    results: null,
    loading: false,
}


const initialURL = {url: '/'}


const SearchContext = React.createContext(initialState)


const SearchProvider = (props) => {
    const {history} = props.children.props
    const [searchState, setSearchState] = useState(initialState)

    const [resultState, setResultsState] = useState(initialResultsState)
    const [url, setURL] = useState(initialURL)

    const urlHead = '/spotify-mosaic'

    const {data, loading} = useAPICall({memoize: true, params: searchState})


    useEffect(() => {
        if (loading) {
            setResultsState(curResState => ({...curResState, loading}))
        } else if (!!data) {
            setResultsState(curResState => ({...curResState, ...data, loading, errorReq: false}))
        }

    }, [data, loading])


    const fixPath = (path) => {
        let stateFromURL = qs.parse(path)
        stateFromURL.playlist = !!stateFromURL.playlist ? stateFromURL.playlist : initialState.playlist
        stateFromURL.playlistSearch = !!stateFromURL.playlistSearch ? stateFromURL.playlistSearch : initialState.playlistSearch
        stateFromURL.playlistId = !!stateFromURL.playlistId ? stateFromURL.playlistId : initialState.playlistId
        stateFromURL.pictureName = !!stateFromURL.pictureName ? stateFromURL.pictureName : initialState.pictureName
        stateFromURL.picture = !!stateFromURL.picture ? stateFromURL.picture : initialState.picture
        stateFromURL.type = !!stateFromURL.type ? stateFromURL.type : initialState.type
        stateFromURL.selectedPlaylist = !!stateFromURL.selectedPlaylist ? stateFromURL.selectedPlaylist : initialState.selectedPlaylist


        const newState = {...searchState, ...stateFromURL}
        return newState
    }

    const updateState = (newState) => {
        if (!newState) {
            setSearchState({...initialState})
            history.push('/login')
        }
        setSearchState(state => ({...state, ...newState}))
        if (_.isEqual(newState, initialState)) {
            history.push('/login')
        }
    }


    // const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (!!searchState.expires_at) {
            interval = setInterval(() => {
                // console.log("Running")
                const secondsNow = new Date().getTime() / 1000
                if (searchState.expires_at <= secondsNow) {

                    try {
                        const expires_at = new Date().getTime() / 1000 + 3000
                        console.log("Changed")
                        getTokenFetch({
                            grant_type: "refresh_token",
                            refresh_token: searchState.RefreshToken
                        }).then(res =>
                            updateState({...searchState, Bearer: res.access_token, expires_at: expires_at, firstLogin: false})
                        ).catch(e => setSearchState({...initialState}))
                    } catch (e) {
                        setSearchState({...initialState})
                    }

                }

            }, 1000);
        } else if (!searchState.expires_at) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [searchState.expires_at]);


    useEffect(() => {
        let search = history.location.search.replace("?", "")
        const path = history.location.pathname
        console.log(history.location)

        if ((path === '/spotify-mosaic/' || path === '/spotify-mosaic') && (!history.location.hash)) {
            setSearchState({...initialState})
            history.push(`/login`)

        } else if (!searchState.Bearer && !search) {

            setSearchState({...initialState, firstLogin: true})
            history.push(`/login`)

        } else if ((history.location.pathname === '/login' || history.location.hash === '#%2Flogin') && !!search) {
            const newBearer = qs.parse(search)
            console.log(newBearer)
            const code = newBearer.code

            const getTokens = getTokenFetch({code: code, grant_type: 'authorization_code'})
            const seconds = (new Date().getTime() / 1000) + 3000

            getTokens.then(res => setSearchState(state =>({
                ...state,
                firstLogin: false,
                code,
                Bearer: res.access_token,
                expires_at: seconds,
                RefreshToken: res.refresh_token
            })))
            history.push(`/upload`)

        } else if (history.location.pathname === '/search' && !!searchState.playlist) {
            updateState({...searchState, playlist: null, playlistInfo: null})
        } else if (!search && !search.picture) {
            history.push(`/upload`)

        } else if (!search && search.picture) {
            history.push(`/createmosaic`)

        } else {
            setSearchState({...initialState})
            history.push(`/login`)

        }

    }, [])


    const getTokenFetch = (body) => {
        const data = {
            ...body,
            redirect_uri: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_APP_API_URL_PROD}/login`,
            client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
            client_secret: process.env.REACT_APP_SPOTIFY_SECRET
        }
        const APIVAL = qs.stringify(data)

        const URL = `https://accounts.spotify.com/api/token`
        return fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'

            },
            body: APIVAL
        }).then(res => {

                return res.json()
            }
        )
    }


    useEffect(() => {
        let search = history.location.search.replace("?", "")
        let path = history.location.pathname
        console.log(searchState)
        const workerState = fixPath(search)
        if (!_.isEqual(workerState, searchState)) {
            if ((path === '/spotify-mosaic/' || path === '/spotify-mosaic') && (!history.path.hash)) {
                setURL({url: `/login`})
                history.push(`/login`)
            } else if (!searchState.Bearer) {
                setURL({url: `/login`})
                history.push(`/login`)
            } else if (!searchState.picture) {
                setURL({url: `${urlHead}/upload`})
                history.push(`/upload`)
            } else if (!searchState.playlist) {
                setURL({url: `/search`})
                history.push(`/search`)

            } else if (!!searchState.playlist && !!searchState.picture && !!searchState.Bearer) {
                setURL({url: `/createmosaic`})
                history.push(`/createmosaic`)
            } else {

                const urlParams = qs.stringify(searchState)
                const newURL = `?${urlParams}`
                setURL({url: newURL})
                history.push(newURL)
            }
        }
    }, [searchState.playlist, searchState.picture, searchState.Bearer])

    return (
        <SearchContext.Provider
            value={{searchState, updateState, resultState, setResultsState, url}}
        >
            {props.children}

        </SearchContext.Provider>
    );

}

export {SearchProvider, SearchContext}

export const useSearchContext = () => useContext(SearchContext);