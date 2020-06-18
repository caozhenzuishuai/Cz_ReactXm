import React, { Component, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { constantRoutes } from "@conf/routes";
const Loading = <div>Loading....</div>;
export default class index extends Component {
  renderRoutes = (routes) => {
    return routes.map((route) => {
      return (
        <Route
          key={route.path}
          path={route.path}
          component={route.component}
          exact
        />
      );
    });
  };
  render() {
    return (
      <Suspense fallback={Loading}>
        <Switch>{this.renderRoutes(constantRoutes)}</Switch>
      </Suspense>
    );
  }
}
