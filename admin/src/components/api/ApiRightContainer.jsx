import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import ApiDetailFrame from './ApiDetailFrame';
import ApiTotalFrame from './ApiTotalFrame';

const ApiRightContainer = ({ checkErr }) => {
  return (
    <Fragment>
      <Route exact path="/admin-api" component={ApiTotalFrame} />
      <Route
        path="/admin-api/:id"
        render={props => <ApiDetailFrame {...props} checkErr={checkErr} />}
      />
    </Fragment>
  );
};

export default ApiRightContainer;
