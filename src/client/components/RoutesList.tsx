import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from '../../util/constants';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Game from '../pages/Game';
import Error from '../pages/Error';

export default function RoutesList() {
  return (
    <main>
        <Routes>
            <Route path={PATHS.home} element={<Home />} />
            <Route path={PATHS.menu} element={<Menu />} />
            <Route path={PATHS.play} element={<Game />} />
            <Route path='*' element={<Error />} />
        </Routes>
    </main>
  );
}
