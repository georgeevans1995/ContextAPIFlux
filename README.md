# Get the power of Flux with the context api

This year Facebook released a new version of React with some pretty big changes including the new context api. To experiment with the new features I decided on trying to replicate the basic language change functionality we used in some of our applications. Normally we would use a library like redux to manage the global state of the app and load in translations using a flux architecture. Instead we are going to use the context api to replicate this functionality without using third party libraries such as redux.

## Initial Project setup

To keep inline with best practice for a React project I am going to be using Flow type checking and eslint to keep all the code clean and unified.

Initialize a new react-native project:
`react-native init ReactLanguageChange`

## Context

In redux there is a concept of a store with actions, mutations and reducers. For managing my context I am going to use the same concept and file structure. The app is going to be really simple with just a dropdown and one word in the center which gets translated when the language is selected, so here is the projects directory structure. The full example repository can be found at the bottom of the article.

|--index.js
|--|app
|--|--App.js
|--|--translations.
|--|components
|--|--index.js
|--|--content.component.js
|--|--language-dropdown.component.js
|--|--language-display.component.js
|--|context
|--|--|global
|--|--|--index.js
|--|--|--global.actions.js
|--|--|--global.consumer.js
|--|--|--global.context.js  
|--|--|--global.mutation.js  
|--|--|--global.provider.js
|--|--|--global.reducer.js

### Providers and consumers

Context involves a concept of provider and consumer components. In our app we are going to make some higher order components to pass the global context down through to the children in a similar way to redux.

The context is defined in exactly the way we would in redux, however we use the new `createContext` function.

```javascript
// global.context.js
// @flow
import React from "react";
import { selectLanguage } from "./global.actions";
import strings from "./translations";
export const languages = ["en", "fr_Fr", "es"];

type State = {
  +isLoading: boolean,
  +language: string,
  +actions: any,
  +strings: any
};

// set the initial state for or context store
let initialState: State = {
  isLoading: false,
  language: languages[0],
  strings: strings.en,
  actions: {
    selectLanguage: languageIndex => {
      selectLanguage(languageIndex);
    }
  }
};
// initialize and export the context
export const GlobalContext = React.createContext(initialState);
```

`createContext` returns a `Provider` and `Consumer`. As suggested by the name, the Provider, "provides" context to its children. We are going to create our own Provider component which extends this functionality and then wrap the entire app in this component so that our context is available everywhere.

```javascript
// global.provider.js
// @flow
import React from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./global.context";

type Props = {
  children?: Node
};

// Create the Provider from the impoerted context
export class GlobalProvider extends React.Component<Props> {
  setComponentState: Function;
  constructor(props: any) {
    super(props);

    this.setComponentState = (state: any) => {
      this.setState(state);
    };

    this.state = {
      ...GlobalStore._currentValue,
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
```

```javascript
//App.js
// @flow

import React, { Component } from "react";
import { Text, LanguageDropdown } from "./app/components";
import { GlobalProvider } from "./context/global";

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
      <GlobalProvider>
        <LanguageDropdown />
        <LanguageDisplay />
      </GlobalProvider>
    );
  }
}
```

**Note:** Just because I have wrapped the whole app in the provider, you could use lots of smaller Providers to keep different contexts exposed to only certain parts of your app.

So now we can use a Consumer to get and update the context as and when we need. To make this super easy I am going to make a higher oreder component which will extend the functionality of a Consumer. This gets a bit ligtle more complex as it has to bring together the concepts of actions, context and reducers all into one file so I am going to break it down into parts:

### Render component

We again use the GlobalContext to create the `<GlobalContext.Consumer>` component. The consumer must return type childern. The wrapped component is the actual component that will receive the context e.g LanguageDropdown in `ConnectGlobal()(LanguageDropdown);`.

```javascript
// import { GlobalContext } from "./global.context";

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
```

### Processing actions

`newProps` above is generated and passed down to the child component. The same as in redux we use `mapStateToProps` and `mapActionsToProps` to give components the ability to get context/state and change it through actions. If you aren't familiar with this I suggest you check out the [react-redux](https://github.com/reduxjs/react-redux) documentation. To be able to do the same thing here we need to accept `mapStateToProps` and `mapActionsToProps` process them and pass them back down to the child as props:

```javascript
constructor(props: {}) {
  super(props);

  this.runDispatch = (action: {}) => {
    this.setComponentState(dispatch(GlobalStore._currentValue, action));
  };

  // returns the requested state from the context
  this.filterState = (mapStateFunction, context) => {
    return typeof mapStateFunction === "function"
      ? mapStateFunction(context)
      : {};

      // TODO: add type error handling
  };

  // binds the requested actions to the context reducers
  this.filterActions = (mapActionsFunction, setComponentState) => {
    return typeof mapActionsFunction === "function"
      ? mapActionsFunction(this.runDispatch)
      : {};

      // TODO: add type error handling
  };
}
```

And thats it! I can now export the above component as a function and we have a bespoke version of the `connect` function in redux for barely any code at all!

```javascript
// export as a higher order component
export function ConnectGlobal(
  mapStateToProps: Function,
  mapActionsToProps: Function
) {
  return (WrappedComponent: any) =>
    class GlobalConsumer extends React.Component<Props> {//Above code here}
```

### Connecting components to context

We export our component wrapped in our `ConnectGlobal` function and our mapped actions and context are available through the component as `this.props`.

```javascript
// language-dropdown.component.js
import { ConnectGlobal, selectLanguage, languages } from "../store/global";
// .. normal react component
const mapContextToProps = context => {
  return {
    language: context.language
  };
};

const mapActionsToProps = dispatch => {
  return {
    changeLanguage: language => dispatch(selectLanguage(language))
  };
};

export default ConnectGlobal(mapContextToProps, mapActionsToProps)(
  LanguageDropdown
);
```

### Pros and cons

This approach is great as it uses very little code and provides us with the ability to add bespoke features going forward. However it is obviously not as feature rich as libraries such as redux which easily integrate with other libraries like react-navigation/react-router. Also in redux it is also substantially easier to debug in the [react-native-debugger](https://github.com/jhen0409/react-native-debugger) as it was built with redux in mind. As context is now fully supported in react who knows we may see tools for the context api come in soon too!

Going forward I think larger scale projects would still benefit from the use of libraries like redux where state really needs to be global (e.g for navigation) or needs to use features like [redux-persist](https://github.com/rt2zz/redux-persist). However smaller stateful components could benifit from using the context api for simplicity and efficiency gains. Going forward it would also be good to wrap some of this code in a library similar to redux, just to keep code DRY. Fortunately others have already been attempting this, check out [react-waterfall](https://github.com/didierfranc/react-waterfall) as an example or get coding and write your own!

Full repository here:
...

To run, clone the project, run `npm install` and `react-native run-ios` or `react-native run-android`.
