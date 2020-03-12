import {useState, useEffect} from 'react';
import {CancelToken, isCancel} from 'axios';
import {apiCall} from "../api";
import qs from 'qs';



const memoizedStorage = {};


const errorData = {
    loading: false,
    errorReq: true,
    result: null,
    loaded:false
};




const useAPICall = ({memoize = false, params}) => {

    const [data, setData] = useState(null)


    useEffect(() => {

        let urlParams;

        const source = CancelToken.source();

        const promise = apiCall
            .get(urlParams, {
                cancelToken : source.token,
            })
            .then(res => {
                setData(res.data)
            })
            .catch(e => {
                if (!isCancel(e)){
                    setData(errorData)
                }
                if (isCancel(e)) return
                throw e;
            })

        if (memoize) memoizedStorage[urlParams] = promise

        return () => {
            source.cancel()
        }


    },[params])

    return {
        data,
        loading: data === null
    }
}


export default useAPICall;