import React, { Fragment } from 'react';
import './App.css';

import { Outlet } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/dist/style.css';

function App() {
  return (
    <Fragment>
      <NavigationMenu/>
      <Outlet/>
    </Fragment>
  );
}

export default App;