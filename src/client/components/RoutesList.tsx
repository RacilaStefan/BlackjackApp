import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from '../../util/constants';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Play from '../pages/Play';

export default function RoutesList() {
  return (
    <main>
        <Routes>
            <Route path={PATHS.home} element={<Home />} />
            <Route path={PATHS.menu} element={<Menu />} />
            <Route path={PATHS.play} element={<Play />} />
        </Routes>
    </main>
  );
}
