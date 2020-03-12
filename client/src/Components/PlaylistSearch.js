import React, {useState, useEffect} from 'react';
import {fetchSpotifyAPI, susepnsify} from "../api";
import {Button, Grid} from '@material-ui/core'
import qs from 'qs';
import Playlist from "./Playlist";


export default function PlaylistSearch({query, type, Bearer, setSearchState}) {


    const [lastSearch,setLastSearch] = useState('')

    let [dataResource, setDataRes] = useState(null)
    const [page, setPage] = useState(0)
    const [lastPage, setLastPage] =useState(0)
    // const [data, setData] =useState(null)

    // let data;

    useEffect(() => {
        if (!! query && page !== lastPage){
            const val = qs.stringify({query, type, offset:page})
            const newData = susepnsify(fetchSpotifyAPI(val, {'Authorization': `Bearer ${Bearer}`}))
            setDataRes(newData)
            setLastPage(page)

        }
        else if (!! query && query !== lastSearch) {
            const val = qs.stringify({query, type, offset:page})
            const newData = susepnsify(fetchSpotifyAPI(val, {'Authorization': `Bearer ${Bearer}`}))
            setDataRes(newData)
            setLastSearch(query)
        } else {
            setDataRes(null)
        }
    }, [query, page])

    let data;
    if (!! dataResource){
        data =dataResource.read()
        console.log(data, "ran")
    }







    return (
        <React.Fragment>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
                style={{padding: 24}}
            >

            {!! data && !! data.playlists &&  data.playlists.items.length > 0 && (


                <React.Fragment>
                    {data.playlists.items.map((playlist, ind) => (
                    <Grid
                        item
                        key={ind}
                        xs={12}
                        md={6}
                        lg={4}
                    >

                        <Playlist
                            key={ind}
                            setSearchState={setSearchState}
                            data={playlist}
                        />
                    </Grid>
                    ))}


                </React.Fragment>

            )}

            </Grid>
            {!! data && (
                <React.Fragment>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"

                    >
                    <Button  disabled={page === 0 ? true : false} onClick={() => setPage(page => page -1)}>Last Page</Button>
                    <Button disabled={((page + 1) * 20) >= data.total ? true : false } onClick={() => setPage(page => page + 1)}>Next Page</Button>
                    </Grid>
                </React.Fragment>

            )}

        </React.Fragment>

    )


}