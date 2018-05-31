// @flow
import React from "react";
import { GlobalContext } from "./global.context";
import _ from "lodash";
import { dispatch } from "./global.reducer";

type Props = {};

export function ConnectGlobal(
  mapStateToProps: Function,
  mapActionsToProps: Function
) {
  return (WrappedComponent: any) =>
    class GlobalConsumer extends React.Component<Props> {
      runDispatch: Function;
      setComponentState: Function;
      filterState: Function;
      filterActions: Function;

      constructor(props: {}) {
        super(props);

        this.runDispatch = (action: {}) => {
          this.setComponentState(
            dispatch(GlobalContext._currentValue, (action: Object))
          );
        };

        this.filterState = (mapStateFunction, context) => {
          return typeof mapStateFunction === "function"
            ? mapStateFunction(context)
            : {};
        };

        this.filterActions = (mapActionsFunction, setComponentState) => {
          return typeof mapActionsFunction === "function"
            ? mapActionsFunction(this.runDispatch)
            : {};
        };
      }

      render() {
        return (
          <GlobalContext.Consumer>
            {context => {
              this.setComponentState = context.setComponentState;
              let newProps = _.assign(
                this.filterState(mapStateToProps, context),
                this.filterActions(mapActionsToProps),
                this.props
              );
              return <WrappedComponent {...newProps} />;
            }}
          </GlobalContext.Consumer>
        );
      }
    };
}
