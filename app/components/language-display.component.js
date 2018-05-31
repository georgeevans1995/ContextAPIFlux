/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { ConnectGlobal } from "../context/global";
import { Content } from "./";

type Props = {
  language: string,
  strings: any
};

class LanguageDisplay extends Component<Props> {
  render() {
    console.log(this.props);
    return <Content>{this.props.strings.hello}</Content>;
  }
}

const mapContextToProps = context => {
  return {
    language: context.language,
    strings: context.strings
  };
};

export default ConnectGlobal(mapContextToProps)(LanguageDisplay);
