import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import Logger from '../util/logger';
import ContextProvider from './components/ContextProvider';
import RoutesList from './components/RoutesList';

import './res/css/home.scss';
import './res/css/game.scss';
import BackButton from './components/BackButton';
import GameDetector from './components/GameDetector';

const log = new Logger('Index');

export let rootElem = document.getElementById('root') as HTMLDivElement;

if (rootElem === null) {
    rootElem = document.createElement('div');
    rootElem.id = 'root';
}

const root = ReactDOM.createRoot(document.body.appendChild(rootElem));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ContextProvider>
                <RoutesList />
                <BackButton />
                <GameDetector />
            </ContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
