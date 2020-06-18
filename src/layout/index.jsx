import React, { Component } from "react";
import { connect } from "react-redux";

import PrimaryLayout from "./PrimaryLayout";
import PublicLayout from "./PublicLayout";
@connect((state) => ({ token: state.token }))
class Layout extends Component {
  render() {
    const { token } = this.props;
    return token ? <PrimaryLayout /> : <PublicLayout />;
  }
}
export default Layout;
