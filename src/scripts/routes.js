import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/app.jsx';
import Home from './pages/home.jsx';

var routes = (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
  </Route>
);

export default routes;