import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createBrowserHistory} from "history";
import {Router} from 'react-router';
import {SearchProvider} from './Contexts/SearchContext';

require('dotenv').config()

const history = createBrowserHistory({ basename: 'spotify-mosaic/#' })


ReactDOM.render(
    <SearchProvider>
        <Router history={history} >
            <App history={history}/>
        </Router>
    </SearchProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
