import React, {useState} from 'react';
import {Input} from "@material-ui/core";

import {makeStyles} from "@material-ui/core/styles";



const useStyles = makeStyles(theme => ({
    search : {
        width: "100%",
    }
}));
export default function SearchPlaylist({setSearchState, playlistSearch}) {
    const classes = useStyles()
    const [inputValue, setInputValue] =useState('')
    const searchQuery = (event) => {
        if (event.key === "Enter" && !!event.target.value) {
            setInputValue('')
            setSearchState({playlistSearch: event.target.value})


        }
    }
    return (
        <Input
            className={classes.search}
            value={inputValue}
            placeholder={'Search Playlist'}
            onChange={(e) => {
                setInputValue(e.target.value)
                if (!! inputValue){
                    setSearchState({playlistSearch: e.target.value})
                }
            }}
            onKeyDown={(e) => searchQuery(e)}

        />
    )
}