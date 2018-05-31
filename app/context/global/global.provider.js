// @flow
import React from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./global.context";

type Props = {
  children?: Node
};

export class GlobalProvider extends React.Component<Props> {
  setComponentState: Function;
  constructor(props: any) {
    super(props);

    this.setComponentState = (state: any) => {
      this.setState(state);
    };

    this.state = {
      ...GlobalContext._currentValue,
      setComponentState: this.setComponentState
    };
  }

  render() {
    return (
      <GlobalContext.Provider value={this.state}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element) || PropTypes.element
};
